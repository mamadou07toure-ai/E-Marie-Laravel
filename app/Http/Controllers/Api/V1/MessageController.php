<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Message;
use App\Models\Notification;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class MessageController extends Controller
{
    /**
     * List all conversations for the current user.
     */
    public function conversations()
    {
        $userId = auth()->id();

        // Collect all unique interlocutor IDs
        $sentTo      = Message::where('sender_id', $userId)->pluck('receiver_id');
        $receivedFrom = Message::where('receiver_id', $userId)->pluck('sender_id');
        $interlocutorIds = $sentTo->merge($receivedFrom)->unique();

        if ($interlocutorIds->isEmpty()) {
            return response()->json([]);
        }

        $conversations = $interlocutorIds->map(function ($otherId) use ($userId) {
            $lastMessage = Message::where(function ($q) use ($userId, $otherId) {
                $q->where('sender_id', $userId)->where('receiver_id', $otherId);
            })->orWhere(function ($q) use ($userId, $otherId) {
                $q->where('sender_id', $otherId)->where('receiver_id', $userId);
            })
                ->latest()
                ->first();

            $unread = Message::where('sender_id', $otherId)
                ->where('receiver_id', $userId)
                ->where('lu', false)
                ->count();

            $other = User::find($otherId, ['id', 'nom', 'prenom', 'role']);

            return [
                'user_id'      => $otherId,
                'user'         => $other,
                'last_message' => $lastMessage?->contenu,
                'last_time'    => $lastMessage?->created_at,
                'unread'       => $unread,
            ];
        })
            ->sortByDesc('last_time')
            ->values();

        return response()->json($conversations);
    }

    /**
     * Get messages between current user and $userId; marks received messages as read.
     */
    public function index($userId)
    {
        $authId = auth()->id();

        Message::where('sender_id', $userId)
            ->where('receiver_id', $authId)
            ->where('lu', false)
            ->update(['lu' => true, 'lu_at' => now()]);

        $messages = Message::where(function ($q) use ($authId, $userId) {
            $q->where('sender_id', $authId)->where('receiver_id', $userId);
        })->orWhere(function ($q) use ($authId, $userId) {
            $q->where('sender_id', $userId)->where('receiver_id', $authId);
        })
            ->with('sender:id,nom,prenom')
            ->oldest()
            ->get();

        $other = User::find($userId, ['id', 'nom', 'prenom', 'role']);

        return response()->json([
            'messages' => $messages,
            'user'     => $other,
        ]);
    }

    /**
     * Send a new message.
     */
    public function store(Request $request)
    {
        $request->validate([
            'receiver_id' => 'required|exists:users,id',
            'contenu'     => 'required|string|max:2000',
            'demande_id'  => 'nullable|exists:demandes,id',
        ]);

        $message = Message::create([
            'sender_id'   => auth()->id(),
            'receiver_id' => $request->receiver_id,
            'demande_id'  => $request->demande_id,
            'contenu'     => $request->contenu,
        ]);

        $sender = auth()->user();
        Notification::create([
            'user_id'    => $request->receiver_id,
            'demande_id' => $request->demande_id,
            'type'       => 'message',
            'message'    => 'Nouveau message de ' . $sender->prenom . ' ' . $sender->nom,
            'lu'         => false,
        ]);

        return response()->json($message->load('sender:id,nom,prenom'), 201);
    }

    /**
     * Edit a message (sender only).
     */
    public function update(Request $request, $id)
    {
        $message = Message::where('id', $id)
            ->where('sender_id', auth()->id())
            ->firstOrFail();

        $request->validate(['contenu' => 'required|string|max:2000']);

        $message->update([
            'contenu'   => $request->contenu,
            'edited_at' => now(),
        ]);

        return response()->json($message);
    }

    /**
     * Delete a message (sender only).
     */
    public function destroy($id)
    {
        $message = Message::where('id', $id)
            ->where('sender_id', auth()->id())
            ->firstOrFail();

        $message->delete();

        return response()->json(['ok' => true]);
    }

    /**
     * Get messages for a specific demand.
     */
    public function getDossierMessages($uuid)
    {
        $demande = \App\Models\Demande::where('uuid', $uuid)->firstOrFail();
        
        $user = auth()->user();
        if ($user->role->value === 'citoyen' && $demande->user_id !== $user->id) {
            abort(403);
        }

        // Mark received messages as read
        Message::where('demande_id', $demande->id)
            ->where('receiver_id', $user->id)
            ->where('lu', false)
            ->update(['lu' => true, 'lu_at' => now()]);

        $messages = Message::where('demande_id', $demande->id)
            ->with('sender:id,nom,prenom,role')
            ->oldest()
            ->get();

        return response()->json($messages);
    }

    /**
     * Send a message on a specific demand.
     */
    public function sendDossierMessage(Request $request, $uuid)
    {
        $demande = \App\Models\Demande::where('uuid', $uuid)->firstOrFail();
        
        $user = auth()->user();
        if ($user->role->value === 'citoyen' && $demande->user_id !== $user->id) {
            abort(403);
        }

        $request->validate([
            'contenu' => 'required|string|max:2000'
        ]);

        // Determine receiver_id
        if ($user->role->value === 'citoyen') {
            $receiverId = $demande->agent_id;
            if (!$receiverId) {
                // Find first admin if no agent assigned
                $receiverId = User::where('role', 'administrateur')->first()?->id;
            }
        } else {
            $receiverId = $demande->user_id;
        }

        if (!$receiverId) {
            return response()->json(['message' => 'Aucun interlocuteur disponible pour ce dossier.'], 400);
        }

        $message = Message::create([
            'sender_id'   => $user->id,
            'receiver_id' => $receiverId,
            'demande_id'  => $demande->id,
            'contenu'     => $request->contenu,
        ]);

        Notification::create([
            'user_id'    => $receiverId,
            'demande_id' => $demande->id,
            'type'       => 'message',
            'message'    => "Dossier {$demande->numero_dossier} : Nouveau commentaire de {$user->prenom} {$user->nom}",
            'lu'         => false,
        ]);

        return response()->json($message->load('sender:id,nom,prenom,role'), 201);
    }
}
