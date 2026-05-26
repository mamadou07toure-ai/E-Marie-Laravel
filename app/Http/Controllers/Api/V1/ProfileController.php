<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rules\Password;

class ProfileController extends Controller
{
    public function update(Request $request)
    {
        $request->validate([
            'nom'       => ['sometimes', 'string', 'max:255'],
            'prenom'    => ['sometimes', 'string', 'max:255'],
            'telephone' => ['sometimes', 'nullable', 'string', 'max:20'],
        ]);

        $data = array_filter(
            $request->only('nom', 'prenom', 'telephone'),
            fn($v) => !is_null($v)
        );

        if (!empty($data)) {
            $request->user()->update($data);
        }

        return response()->json([
            'message' => 'Profil mis à jour avec succès.',
            'user'    => $request->user()->fresh(),
        ]);
    }

    public function updatePassword(Request $request)
    {
        $request->validate([
            'current_password' => ['required', 'current_password'],
            'password'         => ['required', 'confirmed', Password::defaults()],
        ]);

        $request->user()->update([
            'password' => Hash::make($request->password),
        ]);

        return response()->json([
            'message' => 'Mot de passe modifié avec succès.',
        ]);
    }

    public function updateAvatar(Request $request)
    {
        $request->validate([
            'avatar' => ['required', 'image', 'max:2048', 'mimes:jpg,jpeg,png,webp'],
        ]);

        $user = $request->user();

        // Delete old avatar
        if ($user->avatar_path) {
            Storage::disk('public')->delete($user->avatar_path);
        }

        $path = $request->file('avatar')->store('avatars', 'public');

        $user->update(['avatar_path' => $path]);

        return response()->json([
            'message'    => 'Photo de profil mise à jour.',
            'avatar_url' => Storage::disk('public')->url($path),
        ]);
    }
}
