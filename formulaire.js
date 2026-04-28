function recupererValeur(id) {
    const champ = document.getElementById(id);
    return champ ? champ.value : "";
}

function afficherChampEnfants() {
    const situation = recupererValeur('situation');
    const groupeEnfants = document.getElementById('groupe_enfants');
    if (groupeEnfants) {
        if (situation === "Marie(e)" || situation === "Divorce(e)" || situation === "Veuf/Veuve") {
            groupeEnfants.style.display = "block";
        } else {
            groupeEnfants.style.display = "none";
            const inputEnfants = document.getElementById('nbr_enfants');
            if (inputEnfants) inputEnfants.value = "";
        }
    }
}

/* ─────────────────────────────────────────
   GESTION PHOTO (STABLE & COMPATIBLE jsPDF)
───────────────────────────────────────── */
function chargerPhoto(input) {
    const apercu = document.getElementById('apercu_photo');
    const statut = document.getElementById('statut_photo');

    if (!input.files || !input.files[0]) {
        localStorage.removeItem('photo_cv');
        if (apercu) {
            apercu.src = '';
            apercu.style.display = 'none';
        }
        return;
    }

    const fichier = input.files[0];

    if (!fichier.type.startsWith('image/')) {
        alert("Veuillez sélectionner une image (JPG, PNG…).");
        input.value = "";
        return;
    }

    if (statut) statut.textContent = "Chargement de la photo...";

    const reader = new FileReader();
    reader.onload = function (e) {
        const img = new Image();
        img.onload = function () {

            const MAX = 200;
            let w = img.width;
            let h = img.height;

            if (w > h && w > MAX) {
                h = Math.round(h * MAX / w);
                w = MAX;
            } else if (h > MAX) {
                w = Math.round(w * MAX / h);
                h = MAX;
            }

            const canvas = document.createElement('canvas');
            canvas.width = w;
            canvas.height = h;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, w, h);

            // ⚠️ FORMAT JPEG POUR jsPDF
            const base64 = canvas.toDataURL('image/jpeg', 0.85);

            try {
                localStorage.setItem('photo_cv', base64);
                if (statut) statut.textContent = "Photo chargée avec succès.";
            } catch (err) {
                localStorage.removeItem('photo_cv');
                if (statut) statut.textContent = "Photo trop lourde.";
                console.error(err);
            }

            if (apercu) {
                apercu.src = base64;
                apercu.style.display = 'block';
            }
        };

        img.src = e.target.result;
    };

    reader.readAsDataURL(fichier);
}

/* ─────────────────────────────────────────
   VALIDATION + REDIRECTION
───────────────────────────────────────── */
function validerEtAllerAuxModeles() {

    const donneesCV = {
        nom: recupererValeur('nom'),
        metier: recupererValeur('metier'),
        experience: recupererValeur('experience'),
        nationalite: recupererValeur('nationalite'),
        situation: recupererValeur('situation'),
        nbr_enfants: recupererValeur('nbr_enfants'),
        dateNaissance: recupererValeur('date_naissance'),
        age: recupererValeur('age'),
        adresse: recupererValeur('adresse'),
        email: recupererValeur('email'),
        telephone: recupererValeur('telephone'),
        permis: recupererValeur('permis'),
        presentation: recupererValeur('presentation'),
        exp_periode: recupererValeur('exp_periode'),
        exp_poste: recupererValeur('exp_poste'),
        exp_missions: recupererValeur('exp_missions'),
        form_annee: recupererValeur('form_annee'),
        form_diplome: recupererValeur('form_diplome'),
        comp_techniques: recupererValeur('comp_techniques'),
        comp_aptitudes: recupererValeur('comp_aptitudes'),
        comp_logiciels: recupererValeur('comp_logiciels'),
        langues: recupererValeur('langues'),
        hobbies: recupererValeur('hobbies'),
        autres_infos: recupererValeur('autres_infos')
    };

    if (!donneesCV.nom || !donneesCV.metier) {
        alert("Veuillez remplir au moins le Nom et le Métier.");
        return;
    }

    localStorage.setItem('donnees_mon_cv', JSON.stringify(donneesCV));
    window.location.href = 'modele.html';
}