// Exercise data
const exercises = {
    wimHof: { name: 'Wim Hof Method', pattern: '1s in • 1s out', duration: 600, description: 'Rapid breathing', phases: [{type:'inhale',duration:1},{type:'exhale',duration:1}] },
    boxBreathing: { name: 'Box Breathing', pattern: '6s in • 6s hold • 6s out • 6s hold', duration: 360, description: 'Balanced rhythm', phases: [{type:'inhale',duration:6},{type:'hold',duration:6},{type:'exhale',duration:6},{type:'hold',duration:6}] },
    coherentBreathing: { name: 'Coherent Breathing', pattern: '5s in • 5s out', duration: 240, description: 'Smooth rhythm', phases: [{type:'inhale',duration:5},{type:'exhale',duration:5}] },
    nadiShodhana: { name: 'Nadi Shodhana', pattern: '6s in • 6s hold • 6s out • 6s hold', duration: 300, description: 'Alternate nostril breathing', phases: [{type:'inhale',duration:6},{type:'hold',duration:6},{type:'exhale',duration:6},{type:'hold',duration:6}] },
    extendedExhale: { name: 'Extended Exhale', pattern: '4s in • 16s out', duration: 480, description: 'Parasympathetic activation', phases: [{type:'inhale',duration:4},{type:'exhale',duration:16}] },
    bhramariPranayama: { name: 'Bhramari Pranayama', pattern: '4s in • 8s hum', duration: 240, description: 'Humming breath', phases: [{type:'inhale',duration:4},{type:'hold',duration:8}] }
};

const routines = {
    morning: ['wimHof', 'boxBreathing', 'coherentBreathing'],
    midday: ['nadiShodhana'],
    evening: ['extendedExhale', 'bhramariPranayama']
};
