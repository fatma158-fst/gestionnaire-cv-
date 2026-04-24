// ============================================================
//  modele.js  –  Génération PDF avec jsPDF (sans html2canvas)
//  100% fiable : on dessine directement sur le PDF
// ============================================================

function telechargerPDF(style) {

    /* ── 1. Données (valeurs par défaut si champ vide) ── */
    const raw = localStorage.getItem('donnees_mon_cv');
    const inp = raw ? JSON.parse(raw) : {};

    const d = {
        nom:          inp.nom          || 'NOM PRÉNOM',
        metier:       inp.metier       || 'Titre du poste',
        experience:   inp.experience   || '0',
        adresse:      inp.adresse      || 'Ville, Pays',
        email:        inp.email        || 'email@exemple.com',
        telephone:    inp.telephone    || '+00 00 00 00 00',
        presentation: inp.presentation || 'Professionnel motivé et rigoureux, je mets mon expertise au service de votre entreprise pour contribuer à son développement.',
        exp_periode:  inp.exp_periode  || 'Jan. 2020 – Aujourd\'hui',
        exp_poste:    inp.exp_poste    || 'Intitulé du poste – Nom de l\'entreprise',
        exp_missions: inp.exp_missions || '- Description des missions et responsabilités\n- Résultats obtenus et contributions\n- Outils et méthodes utilisés',
        form_annee:   inp.form_annee   || '2018 – 2020',
        form_diplome: inp.form_diplome || 'Diplôme obtenu – Établissement',
        comp_tech:    inp.comp_techniques || 'Compétence 1, Compétence 2, Compétence 3',
        comp_apt:     inp.comp_aptitudes  || 'Rigueur, Esprit d\'équipe, Adaptabilité',
        comp_log:     inp.comp_logiciels  || 'Word, Excel, PowerPoint',
        langues:      inp.langues      || 'Français (Courant), Anglais (Intermédiaire)',
        hobbies:      inp.hobbies      || 'Lecture, Sport, Voyages',
    };

    /* ── 2. Charger jsPDF depuis CDN ── */
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
    script.onload = function () {
        const { jsPDF } = window.jspdf;

        if (style === 'classique')    genClassique(jsPDF, d);
        else if (style === 'moderne') genModerne(jsPDF, d);
        else if (style === 'creatif') genCreatif(jsPDF, d);
        else                          genMinimaliste(jsPDF, d);
    };
    document.head.appendChild(script);
}

/* ════════════════════════════════════════════════
   UTILITAIRES
════════════════════════════════════════════════ */

/** Découpe un texte long en lignes qui tiennent dans maxWidth (mm) */
function splitLines(doc, text, maxWidth) {
    return doc.splitTextToSize(String(text), maxWidth);
}

/** Écrit du texte multiligne et retourne le Y après le dernier saut */
function writeBlock(doc, lines, x, y, lineH) {
    lines.forEach(l => { doc.text(l, x, y); y += lineH; });
    return y;
}

/** Section titre style "classique" */
function sectionTitle(doc, label, y, color) {
    doc.setFillColor(...color);
    doc.rect(15, y, 180, 7, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text(label, 18, y + 5);
    doc.setTextColor(50, 50, 50);
    doc.setFont('helvetica', 'normal');
    return y + 10;
}

/* ════════════════════════════════════════════════
   MODÈLE 1 – CLASSIQUE PRO
════════════════════════════════════════════════ */
function genClassique(jsPDF, d) {
    const doc = new jsPDF({ unit: 'mm', format: 'a4' });
    const W = 210, lx = 15, rx = W - 15, cw = rx - lx;

    // En-tête
    doc.setFillColor(44, 62, 80);
    doc.rect(0, 0, W, 38, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22); doc.setFont('helvetica', 'bold');
    doc.text(d.nom, lx, 16);
    doc.setFontSize(12); doc.setFont('helvetica', 'normal');
    doc.text(d.metier + '  |  ' + d.experience + ' ans d\'expérience', lx, 25);
    doc.setFontSize(9);
    doc.text(d.adresse + '   ' + d.telephone + '   ' + d.email, lx, 33);

    let y = 46;
    doc.setTextColor(50, 50, 50);

    // Profil
    y = sectionTitle(doc, 'PROFIL', y, [44, 62, 80]);
    doc.setFontSize(9);
    const profLines = splitLines(doc, d.presentation, cw - 4);
    y = writeBlock(doc, profLines, lx + 2, y, 5);
    y += 4;

    // Expérience
    y = sectionTitle(doc, 'EXPÉRIENCE PROFESSIONNELLE', y, [44, 62, 80]);
    doc.setFontSize(10); doc.setFont('helvetica', 'bold');
    doc.text(d.exp_poste, lx + 2, y);
    doc.setFontSize(9); doc.setFont('helvetica', 'italic'); doc.setTextColor(100, 100, 100);
    doc.text(d.exp_periode, lx + 2, y + 5);
    doc.setFont('helvetica', 'normal'); doc.setTextColor(50, 50, 50);
    y += 10;
    const mLines = splitLines(doc, d.exp_missions.replace(/\n/g, '  '), cw - 4);
    y = writeBlock(doc, mLines, lx + 2, y, 5);
    y += 4;

    // Formation
    y = sectionTitle(doc, 'FORMATION', y, [44, 62, 80]);
    doc.setFontSize(10); doc.setFont('helvetica', 'bold');
    doc.text(d.form_diplome, lx + 2, y);
    doc.setFontSize(9); doc.setFont('helvetica', 'italic'); doc.setTextColor(100, 100, 100);
    doc.text(d.form_annee, lx + 2, y + 5);
    doc.setFont('helvetica', 'normal'); doc.setTextColor(50, 50, 50);
    y += 12;

    // Compétences
    y = sectionTitle(doc, 'COMPÉTENCES', y, [44, 62, 80]);
    doc.setFontSize(9);
    y = writeBlock(doc, splitLines(doc, 'Techniques : ' + d.comp_tech, cw - 4), lx + 2, y, 5);
    y += 2;
    y = writeBlock(doc, splitLines(doc, 'Logiciels : ' + d.comp_log, cw - 4), lx + 2, y, 5);
    y += 2;
    y = writeBlock(doc, splitLines(doc, 'Aptitudes : ' + d.comp_apt, cw - 4), lx + 2, y, 5);
    y += 4;

    // Langues & Hobbies
    y = sectionTitle(doc, 'LANGUES & LOISIRS', y, [44, 62, 80]);
    doc.setFontSize(9);
    y = writeBlock(doc, splitLines(doc, 'Langues : ' + d.langues, cw - 4), lx + 2, y, 5);
    y += 2;
    writeBlock(doc, splitLines(doc, 'Hobbies : ' + d.hobbies, cw - 4), lx + 2, y, 5);

    doc.save('CV_' + d.nom.replace(/\s+/g, '_') + '_Classique.pdf');
}

/* ════════════════════════════════════════════════
   MODÈLE 2 – MODERNE DARK
════════════════════════════════════════════════ */
function genModerne(jsPDF, d) {
    const doc = new jsPDF({ unit: 'mm', format: 'a4' });
    const W = 210, H = 297;
    const colW = 68, mainX = colW + 5, mainW = W - mainX - 10;

    // Colonne gauche fond sombre
    doc.setFillColor(30, 27, 75);
    doc.rect(0, 0, colW, H, 'F');

    // Nom dans colonne gauche
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(13); doc.setFont('helvetica', 'bold');
    const nomLines = splitLines(doc, d.nom, colW - 8);
    let ly = 20;
    nomLines.forEach(l => { doc.text(l, 5, ly); ly += 7; });
    doc.setFontSize(9); doc.setFont('helvetica', 'normal');
    doc.setTextColor(165, 180, 252);
    const metLines = splitLines(doc, d.metier, colW - 8);
    metLines.forEach(l => { doc.text(l, 5, ly); ly += 5; });
    ly += 5;

    const leftSection = (label) => {
        doc.setFillColor(76, 29, 149);
        doc.rect(0, ly, colW, 6, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(8); doc.setFont('helvetica', 'bold');
        doc.text(label, 5, ly + 4.5);
        doc.setFont('helvetica', 'normal');
        ly += 9;
    };
    const leftText = (txt, maxW) => {
        doc.setTextColor(220, 220, 255);
        doc.setFontSize(8);
        const lines = splitLines(doc, txt, maxW || colW - 8);
        lines.forEach(l => { doc.text(l, 5, ly); ly += 4.5; });
        ly += 2;
    };

    leftSection('CONTACT');
    leftText(d.email);
    leftText(d.telephone);
    leftText(d.adresse);

    leftSection('LANGUES');
    d.langues.split(',').forEach(l => leftText('• ' + l.trim()));

    leftSection('COMPÉTENCES');
    d.comp_tech.split(',').forEach(l => leftText('• ' + l.trim()));

    leftSection('LOGICIELS');
    d.comp_log.split(',').forEach(l => leftText('• ' + l.trim()));

    leftSection('LOISIRS');
    d.hobbies.split(',').forEach(l => leftText('• ' + l.trim()));

    // Colonne droite
    let ry = 18;
    doc.setTextColor(30, 27, 75);
    doc.setFontSize(20); doc.setFont('helvetica', 'bold');
    splitLines(doc, d.nom, mainW).forEach(l => { doc.text(l, mainX, ry); ry += 9; });
    doc.setFontSize(11); doc.setFont('helvetica', 'normal');
    doc.setTextColor(124, 58, 237);
    splitLines(doc, d.metier + ' | ' + d.experience + ' ans', mainW).forEach(l => { doc.text(l, mainX, ry); ry += 6; });
    ry += 4;

    const rightSection = (label) => {
        doc.setDrawColor(124, 58, 237);
        doc.setLineWidth(0.5);
        doc.line(mainX, ry, mainX + mainW, ry);
        doc.setTextColor(124, 58, 237);
        doc.setFontSize(10); doc.setFont('helvetica', 'bold');
        doc.text(label, mainX, ry + 5);
        doc.setFont('helvetica', 'normal');
        ry += 9;
    };

    rightSection('PROFIL');
    doc.setTextColor(60, 60, 60); doc.setFontSize(9);
    ry = writeBlock(doc, splitLines(doc, d.presentation, mainW), mainX, ry, 5);
    ry += 5;

    rightSection('EXPÉRIENCE');
    doc.setFontSize(10); doc.setFont('helvetica', 'bold'); doc.setTextColor(30, 27, 75);
    doc.text(d.exp_poste, mainX, ry); ry += 5;
    doc.setFontSize(8); doc.setFont('helvetica', 'italic'); doc.setTextColor(124, 58, 237);
    doc.text(d.exp_periode, mainX, ry); ry += 6;
    doc.setFont('helvetica', 'normal'); doc.setTextColor(60, 60, 60); doc.setFontSize(9);
    ry = writeBlock(doc, splitLines(doc, d.exp_missions.replace(/\n/g, ' | '), mainW), mainX, ry, 5);
    ry += 5;

    rightSection('FORMATION');
    doc.setFontSize(10); doc.setFont('helvetica', 'bold'); doc.setTextColor(30, 27, 75);
    doc.text(d.form_diplome, mainX, ry); ry += 5;
    doc.setFontSize(8); doc.setFont('helvetica', 'italic'); doc.setTextColor(124, 58, 237);
    doc.text(d.form_annee, mainX, ry); ry += 6;
    ry += 3;

    rightSection('APTITUDES');
    doc.setFont('helvetica', 'normal'); doc.setTextColor(60, 60, 60); doc.setFontSize(9);
    ry = writeBlock(doc, splitLines(doc, d.comp_apt, mainW), mainX, ry, 5);

    doc.save('CV_' + d.nom.replace(/\s+/g, '_') + '_Moderne.pdf');
}

/* ════════════════════════════════════════════════
   MODÈLE 3 – CRÉATIF BOLD
════════════════════════════════════════════════ */
function genCreatif(jsPDF, d) {
    const doc = new jsPDF({ unit: 'mm', format: 'a4' });
    const W = 210, lx = 15, cw = 180;

    // Bandeau haut
    doc.setFillColor(30, 27, 75);
    doc.rect(0, 0, W, 42, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24); doc.setFont('helvetica', 'bold');
    doc.text(d.nom, lx, 18);
    doc.setFontSize(11); doc.setFont('helvetica', 'normal');
    doc.setTextColor(165, 180, 252);
    doc.text(d.metier.toUpperCase(), lx, 28);

    // Barre contact violette
    doc.setFillColor(124, 58, 237);
    doc.rect(0, 42, W, 10, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(8);
    doc.text(d.email + '   |   ' + d.telephone + '   |   ' + d.adresse, lx, 48.5);

    let y = 62;
    const section = (label) => {
        doc.setFillColor(245, 243, 255);
        doc.rect(lx, y, cw, 7, 'F');
        doc.setDrawColor(124, 58, 237);
        doc.setLineWidth(0.8);
        doc.line(lx, y, lx, y + 7);
        doc.setTextColor(124, 58, 237);
        doc.setFontSize(10); doc.setFont('helvetica', 'bold');
        doc.text(label, lx + 3, y + 5);
        doc.setFont('helvetica', 'normal'); doc.setTextColor(50, 50, 50);
        y += 11;
    };

    doc.setFontSize(9);

    section('PROFIL');
    y = writeBlock(doc, splitLines(doc, d.presentation, cw - 4), lx + 2, y, 5);
    y += 5;

    section('EXPÉRIENCE PROFESSIONNELLE');
    doc.setFont('helvetica', 'bold'); doc.setFontSize(10);
    doc.text(d.exp_poste, lx + 2, y); y += 5;
    doc.setFont('helvetica', 'italic'); doc.setFontSize(8); doc.setTextColor(124, 58, 237);
    doc.text(d.exp_periode, lx + 2, y); y += 6;
    doc.setFont('helvetica', 'normal'); doc.setFontSize(9); doc.setTextColor(50, 50, 50);
    y = writeBlock(doc, splitLines(doc, d.exp_missions.replace(/\n/g, ' | '), cw - 4), lx + 2, y, 5);
    y += 5;

    section('FORMATION');
    doc.setFont('helvetica', 'bold'); doc.setFontSize(10);
    doc.text(d.form_diplome, lx + 2, y); y += 5;
    doc.setFont('helvetica', 'italic'); doc.setFontSize(8); doc.setTextColor(124, 58, 237);
    doc.text(d.form_annee, lx + 2, y); y += 8;
    doc.setFont('helvetica', 'normal'); doc.setFontSize(9); doc.setTextColor(50, 50, 50);

    section('COMPÉTENCES');
    y = writeBlock(doc, splitLines(doc, 'Techniques : ' + d.comp_tech, cw - 4), lx + 2, y, 5);
    y += 2;
    y = writeBlock(doc, splitLines(doc, 'Logiciels : ' + d.comp_log, cw - 4), lx + 2, y, 5);
    y += 2;
    y = writeBlock(doc, splitLines(doc, 'Aptitudes : ' + d.comp_apt, cw - 4), lx + 2, y, 5);
    y += 5;

    section('LANGUES & LOISIRS');
    y = writeBlock(doc, splitLines(doc, 'Langues : ' + d.langues, cw - 4), lx + 2, y, 5);
    y += 2;
    writeBlock(doc, splitLines(doc, 'Hobbies : ' + d.hobbies, cw - 4), lx + 2, y, 5);

    doc.save('CV_' + d.nom.replace(/\s+/g, '_') + '_Creatif.pdf');
}

/* ════════════════════════════════════════════════
   MODÈLE 4 – MINIMALISTE CHIC
════════════════════════════════════════════════ */
function genMinimaliste(jsPDF, d) {
    const doc = new jsPDF({ unit: 'mm', format: 'a4' });
    const W = 210, lx = 20, cw = 170;

    // Nom grand
    doc.setTextColor(34, 34, 34);
    doc.setFontSize(28); doc.setFont('helvetica', 'normal');
    doc.text(d.nom, lx, 28);

    // Ligne sous le nom
    doc.setDrawColor(34, 34, 34);
    doc.setLineWidth(0.8);
    doc.line(lx, 32, W - lx, 32);

    doc.setFontSize(11); doc.setTextColor(85, 85, 85);
    doc.text(d.metier.toUpperCase(), lx, 39);

    doc.setFontSize(8); doc.setTextColor(150, 150, 150);
    doc.text(d.email + '   ·   ' + d.telephone + '   ·   ' + d.adresse, lx, 46);

    let y = 56;
    const section = (label) => {
        doc.setFontSize(8); doc.setFont('helvetica', 'bold');
        doc.setTextColor(180, 180, 180);
        doc.text(label.toUpperCase(), lx, y);
        doc.setDrawColor(220, 220, 220);
        doc.setLineWidth(0.3);
        doc.line(lx, y + 1.5, W - lx, y + 1.5);
        doc.setFont('helvetica', 'normal'); doc.setTextColor(50, 50, 50);
        y += 7;
    };

    doc.setFontSize(9);

    section('Profil');
    y = writeBlock(doc, splitLines(doc, d.presentation, cw), lx, y, 5.5);
    y += 6;

    section('Expérience');
    doc.setFont('helvetica', 'bold'); doc.setFontSize(10); doc.setTextColor(34, 34, 34);
    doc.text(d.exp_poste, lx, y); y += 5;
    doc.setFont('helvetica', 'normal'); doc.setFontSize(8); doc.setTextColor(150, 150, 150);
    doc.text(d.exp_periode, lx, y); y += 6;
    doc.setFontSize(9); doc.setTextColor(70, 70, 70);
    y = writeBlock(doc, splitLines(doc, d.exp_missions.replace(/\n/g, ' | '), cw), lx, y, 5.5);
    y += 6;

    section('Formation');
    doc.setFont('helvetica', 'bold'); doc.setFontSize(10); doc.setTextColor(34, 34, 34);
    doc.text(d.form_diplome, lx, y); y += 5;
    doc.setFont('helvetica', 'normal'); doc.setFontSize(8); doc.setTextColor(150, 150, 150);
    doc.text(d.form_annee, lx, y); y += 8;

    section('Compétences');
    doc.setFontSize(9); doc.setTextColor(70, 70, 70);
    y = writeBlock(doc, splitLines(doc, d.comp_tech, cw), lx, y, 5.5);
    y += 2;
    y = writeBlock(doc, splitLines(doc, d.comp_log, cw), lx, y, 5.5);
    y += 2;
    y = writeBlock(doc, splitLines(doc, d.comp_apt, cw), lx, y, 5.5);
    y += 6;

    section('Langues & Loisirs');
    y = writeBlock(doc, splitLines(doc, d.langues, cw), lx, y, 5.5);
    y += 2;
    writeBlock(doc, splitLines(doc, d.hobbies, cw), lx, y, 5.5);

    doc.save('CV_' + d.nom.replace(/\s+/g, '_') + '_Minimaliste.pdf');
}