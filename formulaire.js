function recupererValeur(id) {
    const champ = document.getElementById(id);
    return champ ? champ.value : "";
}

function afficherChampEnfants() {
    const situation = recupererValeur('situation');
    const groupeEnfants = document.getElementById('groupe_enfants');
    
    if (groupeEnfants) {
        if (situation === "Marié(e)" || situation === "Divorcé(e)" || situation === "Veuf/Veuve") {
            groupeEnfants.style.display = "block";
        } else {
            groupeEnfants.style.display = "none";
            const inputEnfants = document.getElementById('nbr_enfants');
            if (inputEnfants) inputEnfants.value = ""; // Vide le champ caché pour la cohérence
        }
    }
}

function validerEtAllerAuxModeles() {
    // 1. On récupère les données
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

    // 2. VERIFICATION (On vérifie AVANT de sauvegarder et de partir)
    if (!donneesCV.nom || !donneesCV.metier) {
        alert("⚠️ Veuillez remplir au moins votre Nom et votre Métier.");
        return; // On arrête tout ici si c'est vide
    }

    // 3. SAUVEGARDE
    localStorage.setItem('donnees_mon_cv', JSON.stringify(donneesCV));
    
    // 4. REDIRECTION (Seulement si tout est OK)
    window.location.href = 'modele.html';
}