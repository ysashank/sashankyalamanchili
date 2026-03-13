// Home & exercises page logic
if (document.body.classList.contains('home')) {
    document.querySelectorAll('nav button').forEach(btn => {
        btn.onclick = () => {
            audio.init();
            sessionStorage.routine = btn.dataset.routine;
            location.href = 'session.html';
        };
    });
}

if (document.body.classList.contains('exercises')) {
    ['morning', 'midday', 'evening'].forEach(r => {
        const container = document.getElementById(r + '-cards');
        routines[r].forEach(id => {
            const ex = exercises[id];
            const m = Math.floor(ex.duration / 60);
            container.innerHTML += `
                <div class="card">
                    <h3>${ex.name}</h3>
                    <p class="pattern">${ex.pattern}</p>
                    <p>${m} minute${m>1?'s':''}</p>
                    <p>${ex.description}</p>
                    <button data-exercise="${id}">▶</button>
                </div>`;
        });
    });
    
    document.querySelector('.back').onclick = () => location.href = 'index.html';
    document.querySelectorAll('.card button').forEach(btn => {
        btn.onclick = () => {
            audio.init();
            sessionStorage.exercise = btn.dataset.exercise;
            location.href = 'session.html';
        };
    });
}
