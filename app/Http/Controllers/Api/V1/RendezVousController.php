<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Demande;
use App\Models\RendezVous;
use App\Models\Notification;
use Illuminate\Http\Request;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class RendezVousController extends Controller
{
    /**
     * Get dynamic available slots for the next 7 working days.
     */
    public function getSlots($uuid)
    {
        $demande = Demande::where('uuid', $uuid)->firstOrFail();
        
        $slotsByDay = [];
        $today = Carbon::today();
        
        // Loop over the next 7 days
        $daysCount = 0;
        $currentDay = $today->copy();
        
        while ($daysCount < 7) {
            $currentDay->addDay();
            
            // Skip weekends
            if ($currentDay->isWeekend()) {
                continue;
            }
            
            $dayKey = $currentDay->format('Y-m-d');
            $slotsByDay[$dayKey] = [
                'date' => $currentDay->translatedFormat('l d F Y'),
                'raw_date' => $dayKey,
                'slots' => []
            ];
            
            // Working hours: 09:00 to 16:30 with 30 mins intervals
            $startHour = 9;
            $endHour = 16;
            
            for ($hour = $startHour; $hour <= $endHour; $hour++) {
                foreach ([0, 30] as $minute) {
                    if ($hour === 16 && $minute > 30) {
                        continue;
                    }
                    
                    $timeString = sprintf('%02d:%02d', $hour, $minute);
                    $slotDateTime = Carbon::createFromFormat('Y-m-d H:i', $dayKey . ' ' . $timeString);
                    
                    // Check if slot is already booked in DB
                    $isBooked = RendezVous::where('date_rdv', $slotDateTime)->exists();
                    
                    $slotsByDay[$dayKey]['slots'][] = [
                        'time' => $timeString,
                        'available' => !$isBooked,
                        'raw_datetime' => $slotDateTime->toIso8601String()
                    ];
                }
            }
            
            $daysCount++;
        }
        
        return response()->json(array_values($slotsByDay));
    }

    /**
     * Book a slot for a specific demand.
     */
    public function bookSlot(Request $request, $uuid)
    {
        $demande = Demande::where('uuid', $uuid)->firstOrFail();
        
        // Ensure user is the owner
        if ($demande->user_id !== auth()->id()) {
            abort(403);
        }

        $request->validate([
            'date_rdv' => 'required|date'
        ]);

        $requestedDateTime = Carbon::parse($request->date_rdv);

        // Check if slot is already booked
        $exists = RendezVous::where('date_rdv', $requestedDateTime)->exists();
        if ($exists) {
            return response()->json(['message' => 'Ce créneau horaire est déjà réservé.'], 400);
        }

        // Check if demand already has an appointment
        $existingRdv = RendezVous::where('demande_id', $demande->id)->first();
        if ($existingRdv) {
            return response()->json(['message' => 'Un rendez-vous est déjà planifié pour ce dossier.'], 400);
        }

        $rdv = RendezVous::create([
            'demande_id' => $demande->id,
            'user_id' => auth()->id(),
            'date_rdv' => $requestedDateTime,
            'statut' => 'confirme',
            'notes' => $request->notes ?? 'Retrait physique de l\'acte officiel.'
        ]);

        // Add history
        \App\Models\HistoriqueStatut::create([
            'demande_id'    => $demande->id,
            'user_id'       => auth()->id(),
            'ancien_statut' => is_object($demande->statut) ? $demande->statut->value : $demande->statut,
            'nouveau_statut'=> is_object($demande->statut) ? $demande->statut->value : $demande->statut,
            'commentaire'   => "Rendez-vous planifié pour le retrait de l'acte physique le " . $requestedDateTime->translatedFormat('d F Y à H\hi') . ".",
        ]);

        // Alert the agent if assigned
        if ($demande->agent_id) {
            Notification::create([
                'user_id' => $demande->agent_id,
                'demande_id' => $demande->id,
                'type' => 'dossier',
                'message' => "Le citoyen a planifié un rendez-vous de retrait pour le dossier {$demande->numero_dossier} le " . $requestedDateTime->translatedFormat('d/m à H\hi'),
                'lu' => false
            ]);
        }

        return response()->json([
            'message' => 'Rendez-vous planifié avec succès.',
            'rdv' => $rdv
        ], 201);
    }

    /**
     * Get appointment for a specific demand.
     */
    public function getRdv($uuid)
    {
        $demande = Demande::where('uuid', $uuid)->firstOrFail();
        $rdv = RendezVous::where('demande_id', $demande->id)->first();
        return response()->json($rdv);
    }
}
