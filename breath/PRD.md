# Breathwork App - Product Requirements Document

## Overview
A minimal breathing app that guides you through proven breathing techniques with sound and visual rhythm. Just click and breathe.

---

## The Experience

### Home Screen

**What you see:**
- "Breathwork"
- "Just click and follow."
- Three buttons: Morning, Midday, Evening
- "See exercises" link

**What happens:**
- Click a routine → Start breathing
- Click "See exercises" → Browse individual exercises

---

### Breathing Session

**What you see:**
- Exercise name
- Breathing phase ("Inhale" / "Exhale" / "Hold")
- Animated circle that breathes with you
- Countdown showing seconds remaining
- Stop button

**What you experience:**
- Circle grows as you inhale
- Circle shrinks as you exhale
- Circle holds steady when you hold
- Gentle tick sound every second, frequency tuned to the phase:
  - **Inhale**: 528 Hz (energizing, cellular vitality)
  - **Exhale**: 432 Hz (calming, harmony)
  - **Hold**: 396 Hz (grounding, stillness)
- Screen stays awake
- Stop anytime to return home

**How it flows:**
1. 5 seconds to prepare
2. Follow the rhythm
3. Complete the exercise (or full routine)
4. Return home

---

### Exercises Page

**What you see:**
- Back button
- "Breathing Exercises"
- Three sections: Morning, Midday, Evening
- Exercise cards with:
  - Name
  - Pattern (e.g., "4s in • 8s out")
  - Duration
  - Description
  - Play button

**What happens:**
- Scroll horizontally through exercises
- Click play to start any exercise
- Click back to return home

---

## The Exercises

#### Morning Routine
1. **Wim Hof Method**
   - Pattern: 1s in • 1s out
   - Duration: 10 minutes
   - Type: Rapid breathing

2. **Box Breathing**
   - Pattern: 6s in • 6s hold • 6s out • 6s hold
   - Duration: 6 minutes
   - Type: Balanced rhythm

3. **Coherent Breathing**
   - Pattern: 5s in • 5s out
   - Duration: 4 minutes
   - Type: Smooth rhythm

#### Midday Routine
1. **Nadi Shodhana**
   - Pattern: 6s in • 6s hold • 6s out • 6s hold
   - Duration: 5 minutes
   - Type: Alternate nostril breathing

#### Evening Routine
1. **Extended Exhale**
   - Pattern: 4s in • 16s out
   - Duration: 8 minutes
   - Type: Parasympathetic activation

2. **Bhramari Pranayama**
   - Pattern: 4s in • 8s hum
   - Duration: 4 minutes
   - Type: Humming breath

---

## The Technology

### Audio
- Continuous tick every second during breathing
- Three healing frequencies:
  - 528 Hz for inhale (DNA repair, vitality)
  - 432 Hz for exhale (relaxation, harmony)
  - 396 Hz for hold (grounding, coherence)
- Short, gentle ticks (100-150ms)
- Moderate volume (0.4)
- Preparation countdown uses hold frequency (396 Hz)

---

### Navigation
```
Home
  ├─→ Select Routine → Session → Home
  └─→ See Exercises → Exercises Page
                        ├─→ Back → Home
                        └─→ Play → Session → Home
```

### Universal Compatibility
- Works everywhere, on any device
- Audio unlocks on first interaction
- Screen stays awake during sessions
- Responsive to any screen size
- Fast, smooth, reliable
- Progressive Web App (installable)
- Works offline after first load

---

## Implementation Notes

### State Management
The app tracks:
- Current exercise and routine
- Session timing and phase
- Audio system state
- Wake lock status

### Error Handling
Everything fails gracefully with user awareness:
- No audio? Show subtle toast "Audio unavailable - visual guidance only"
- Visual guidance continues regardless
- No wake lock? Session continues normally
- Navigation errors? Return home safely
- Toast auto-dismisses after 3 seconds
- No intrusive error popups

---

## Quality Standards

### Performance
- 60fps animations
- Audio latency < 100ms
- Instant interactions
- Loads in < 2 seconds
- Offline-capable after first visit

### Accessibility
- Works with screen readers
- ARIA live regions announce phase changes
- Full keyboard navigation
- High contrast design
- Clear focus indicators

### Reliability
- Works offline (PWA with service worker)
- No data loss
- Graceful degradation
- Universal compatibility
- Auto-caches all assets

### Design Philosophy
- Minimal interface
- Glass-morphic elements
- Dark, calming theme
- Smooth animations
- Zero UI friction
- Subtle, helpful feedback
- The breathing is the interface
