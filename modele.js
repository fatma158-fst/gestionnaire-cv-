function clean(str) {
    return String(str || '')
        .replace(/\u2013|\u2014/g, '-')       // tirets longs
        .replace(/\u2018|\u2019/g, "'")        // apostrophes typographiques
        .replace(/\u201C|\u201D/g, '"')        // guillemets
        .replace(/\u2026/g, '...')             // points de suspension
        .replace(/[^\x00-\xFF]/g, '');         // tout autre caractere non-latin
}

function telechargerPDF(style) {
    var raw = localStorage.getItem('donnees_mon_cv');
    var inp = raw ? JSON.parse(raw) : {};

    var photoBase64 = localStorage.getItem('photo_cv') || null;

    var d = {
        nom:          clean(inp.nom          || inp.prenom_nom    || 'NOM PRENOM'),
        metier:       clean(inp.metier       || inp.poste         || 'Titre du poste'),
        experience:   clean(inp.experience   || inp.annees_exp    || '0'),
        adresse:      clean(inp.adresse      || inp.ville         || 'Ville, Pays'),
        email:        clean(inp.email        || 'email@exemple.com'),
        telephone:    clean(inp.telephone    || inp.tel           || '+00 00 00 00 00'),
        presentation: clean(inp.presentation || inp.profil        || 'Professionnel(le) experimente(e), je mets mes competences au service de votre entreprise.'),
        exp_periode:  clean(inp.exp_periode  || inp.periode       || '2020 - Aujourd\'hui'),
        exp_poste:    clean(inp.exp_poste    || inp.poste_exp     || 'Intitule du poste - Entreprise'),
        exp_missions: clean(inp.exp_missions || inp.missions      || 'Description des missions\nResultats obtenus\nOutils utilises'),
        form_annee:   clean(inp.form_annee   || inp.annee_diplome || '2018 - 2020'),
        form_diplome: clean(inp.form_diplome || inp.diplome       || 'Diplome - Etablissement'),
        comp_tech:    clean(inp.comp_techniques || inp.comp_tech  || 'Competence 1, Competence 2'),
        comp_apt:     clean(inp.comp_aptitudes  || inp.comp_apt   || 'Rigueur, Esprit d\'equipe, Adaptabilite'),
        comp_log:     clean(inp.comp_logiciels  || inp.comp_log   || 'Word, Excel, PowerPoint'),
        langues:      clean(inp.langues      || 'Francais (Courant), Anglais (Intermediaire)'),
        hobbies:      clean(inp.hobbies      || inp.loisirs       || 'Lecture, Sport, Voyages'),
    };

    if (!window.jspdf) {
        alert('Erreur : jsPDF n\'est pas charge. Verifiez votre connexion internet.');
        return;
    }
    var jsPDF = window.jspdf.jsPDF;

    if      (style === 'classique')  genClassique(jsPDF, d, photoBase64);
    else if (style === 'moderne')    genModerne(jsPDF, d, photoBase64);
    else if (style === 'creatif')    genCreatif(jsPDF, d, photoBase64);
    else                             genMinimaliste(jsPDF, d, photoBase64);
}


function splitLines(doc, text, maxWidth) {
    return doc.splitTextToSize(String(text || ''), maxWidth);
}

function writeBlock(doc, lines, x, y, lineH) {
    lines.forEach(function(l) { doc.text(l, x, y); y += lineH; });
    return y;
}

function writeMissions(doc, text, x, y, lineH, maxWidth) {
    var lignes = String(text || '').split('\n');
    lignes.forEach(function(ligne) {
        ligne = ligne.replace(/^[-*+>]\s*/, '').trim();
        if (!ligne) return;
        var wrapped = doc.splitTextToSize('- ' + ligne, maxWidth);
        wrapped.forEach(function(l) { doc.text(l, x, y); y += lineH; });
    });
    return y;
}
function addPhoto(doc, base64, x, y, w, h) {
    if (!base64) return;

    try {
        doc.addImage(base64, 'JPEG', x, y, w, h);
    } catch (e) {
        doc.setFillColor(220, 220, 220);
        doc.rect(x, y, w, h, 'F');
        doc.setFontSize(7);
        doc.setTextColor(120, 120, 120);
        doc.text('Photo', x + w / 2, y + h / 2, { align: 'center' });
    }
}
function genClassique(jsPDF, d, photo) {
    var doc = new jsPDF({ unit: 'mm', format: 'a4' });
    var W = 210, H = 297;
    var colG = 68;
    var mainX = colG + 7;
    var mainW = W - mainX - 10;

    doc.setFillColor(22, 38, 68);
    doc.rect(0, 0, colG, H, 'F');

    var photoSize = 28;
    var photoX = (colG - photoSize) / 2;
    var photoY = 12;

    if (photo) {
        doc.setFillColor(255, 255, 255);
        doc.roundedRect(photoX - 1, photoY - 1, photoSize + 2, photoSize + 2, 3, 3, 'F');
        addPhoto(doc, photo, photoX, photoY, photoSize, photoSize);
    } else {
        doc.setFillColor(50, 80, 130);
        doc.circle(colG / 2, photoY + photoSize / 2, photoSize / 2 + 2, 'F');
        doc.setFillColor(255, 255, 255);
        doc.circle(colG / 2, photoY + photoSize / 2, photoSize / 2, 'F');
        var initials = d.nom.split(' ').map(function(n){ return n[0] || ''; }).join('').toUpperCase().slice(0, 2);
        doc.setTextColor(22, 38, 68);
        doc.setFontSize(14); doc.setFont('helvetica', 'bold');
        doc.text(initials, colG / 2, photoY + photoSize / 2 + 2, { align: 'center' });
    }

    var ly = photoY + photoSize + 13;
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(11); doc.setFont('helvetica', 'bold');
    splitLines(doc, d.nom.toUpperCase(), colG - 10).forEach(function(l) {
        doc.text(l, colG / 2, ly, { align: 'center' }); ly += 6;
    });
    doc.setFontSize(8); doc.setFont('helvetica', 'normal');
    doc.setTextColor(150, 190, 240);
    splitLines(doc, d.metier, colG - 10).forEach(function(l) {
        doc.text(l, colG / 2, ly, { align: 'center' }); ly += 5;
    });
    ly += 6;

    function leftSection(label) {
        doc.setDrawColor(80, 120, 190);
        doc.setLineWidth(0.3);
        doc.line(8, ly, colG - 8, ly);
        doc.setTextColor(100, 170, 255);
        doc.setFontSize(7.5); doc.setFont('helvetica', 'bold');
        doc.text(label, 8, ly + 5);
        ly += 9;
    }
    function leftText(txt) {
        doc.setTextColor(200, 215, 240);
        doc.setFontSize(8); doc.setFont('helvetica', 'normal');
        splitLines(doc, txt, colG - 14).forEach(function(l) { doc.text(l, 10, ly); ly += 4.5; });
        ly += 1;
    }

    leftSection('CONTACT');
    leftText(d.email);
    leftText(d.telephone);
    leftText(d.adresse);
    ly += 3;

    leftSection('COMPETENCES');
    d.comp_tech.split(',').forEach(function(c) { leftText('> ' + c.trim()); });
    ly += 2;

    leftSection('LOGICIELS');
    d.comp_log.split(',').forEach(function(c) { leftText('> ' + c.trim()); });
    ly += 2;

    leftSection('LANGUES');
    d.langues.split(',').forEach(function(l) { leftText('> ' + l.trim()); });
    ly += 2;

    leftSection('LOISIRS');
    d.hobbies.split(',').forEach(function(h) { leftText('> ' + h.trim()); });

    /* Colonne droite */
    var ry = 15;

    doc.setTextColor(22, 38, 68);
    doc.setFontSize(22); doc.setFont('helvetica', 'bold');
    splitLines(doc, d.nom, mainW).forEach(function(l) { doc.text(l, mainX, ry); ry += 10; });

    doc.setFontSize(10); doc.setFont('helvetica', 'normal');
    doc.setTextColor(60, 100, 180);
    doc.text(d.metier + '  |  ' + d.experience + ' ans', mainX, ry);
    ry += 5;

    doc.setDrawColor(180, 200, 230);
    doc.setLineWidth(0.5);
    doc.line(mainX, ry, W - 10, ry);
    ry += 9;

    function rightSection(label) {
        doc.setFillColor(235, 242, 255);
        doc.rect(mainX, ry, mainW, 7, 'F');
        doc.setFillColor(60, 100, 180);
        doc.rect(mainX, ry, 2.5, 7, 'F');
        doc.setTextColor(22, 38, 68);
        doc.setFontSize(9); doc.setFont('helvetica', 'bold');
        doc.text(label, mainX + 5, ry + 4.8);
        doc.setFont('helvetica', 'normal');
        ry += 11;
    }

    rightSection('PROFIL PROFESSIONNEL');
    doc.setTextColor(55, 55, 70); doc.setFontSize(9);
    ry = writeBlock(doc, splitLines(doc, d.presentation, mainW - 2), mainX, ry, 5);
    ry += 7;

    rightSection('EXPERIENCE PROFESSIONNELLE');
    doc.setFontSize(10); doc.setFont('helvetica', 'bold'); doc.setTextColor(22, 38, 68);
    doc.text(d.exp_poste, mainX, ry); ry += 5;
    doc.setFontSize(8); doc.setFont('helvetica', 'italic'); doc.setTextColor(80, 120, 190);
    doc.text(d.exp_periode, mainX, ry); ry += 6;
    doc.setFont('helvetica', 'normal'); doc.setFontSize(9); doc.setTextColor(55, 55, 70);
    ry = writeMissions(doc, d.exp_missions, mainX, ry, 5, mainW - 2);
    ry += 7;

    rightSection('FORMATION');
    doc.setFontSize(10); doc.setFont('helvetica', 'bold'); doc.setTextColor(22, 38, 68);
    doc.text(d.form_diplome, mainX, ry); ry += 5;
    doc.setFontSize(8); doc.setFont('helvetica', 'italic'); doc.setTextColor(80, 120, 190);
    doc.text(d.form_annee, mainX, ry); ry += 10;

    rightSection('APTITUDES');
    doc.setFont('helvetica', 'normal'); doc.setFontSize(9); doc.setTextColor(55, 55, 70);
    ry = writeBlock(doc, splitLines(doc, d.comp_apt, mainW - 2), mainX, ry, 5);

    doc.save('CV_' + d.nom.replace(/\s+/g, '_') + '_Classique.pdf');
}


function genModerne(jsPDF, d, photo) {
    var doc = new jsPDF({ unit: 'mm', format: 'a4' });
    var W = 210, H = 297;
    var colW = 70, mainX = colW + 8, mainW = W - mainX - 10;

    doc.setFillColor(16, 12, 48);
    doc.rect(0, 0, colW, H, 'F');
    doc.setFillColor(100, 30, 210);
    doc.rect(0, 0, colW, 65, 'F');

    /* Photo ou initiales */
    var photoSize = 26;
    var photoX = (colW - photoSize) / 2;
    var photoY = 10;

    if (photo) {
        doc.setFillColor(255, 255, 255);
        doc.roundedRect(photoX - 1, photoY - 1, photoSize + 2, photoSize + 2, 3, 3, 'F');
        addPhoto(doc, photo, photoX, photoY, photoSize, photoSize);
    } else {
        doc.setFillColor(130, 60, 230);
        doc.circle(colW / 2, photoY + photoSize / 2, photoSize / 2 + 1, 'F');
        doc.setFillColor(255, 255, 255);
        doc.circle(colW / 2, photoY + photoSize / 2, photoSize / 2, 'F');
        var initials = d.nom.split(' ').map(function(n){ return n[0] || ''; }).join('').toUpperCase().slice(0, 2);
        doc.setTextColor(16, 12, 48);
        doc.setFontSize(13); doc.setFont('helvetica', 'bold');
        doc.text(initials, colW / 2, photoY + photoSize / 2 + 2, { align: 'center' });
    }

    var ly = photoY + photoSize + 11;
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(11); doc.setFont('helvetica', 'bold');
    splitLines(doc, d.nom.toUpperCase(), colW - 10).forEach(function(l) { doc.text(l, 5, ly); ly += 6; });
    doc.setFontSize(8); doc.setFont('helvetica', 'normal');
    doc.setTextColor(210, 190, 255);
    splitLines(doc, d.metier, colW - 10).forEach(function(l) { doc.text(l, 5, ly); ly += 5; });
    ly = 73;

    function leftSection(label) {
        doc.setFillColor(100, 30, 210);
        doc.rect(0, ly, colW, 7, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(8); doc.setFont('helvetica', 'bold');
        doc.text(label, 5, ly + 5);
        doc.setFont('helvetica', 'normal');
        ly += 10;
    }
    function leftText(txt) {
        doc.setTextColor(185, 195, 235);
        doc.setFontSize(8);
        splitLines(doc, txt, colW - 12).forEach(function(l) { doc.text(l, 5, ly); ly += 4.5; });
        ly += 1.5;
    }

    leftSection('CONTACT');
    leftText(d.email);
    leftText(d.telephone);
    leftText(d.adresse);
    ly += 2;

    leftSection('LANGUES');
    d.langues.split(',').forEach(function(l) { leftText('> ' + l.trim()); });
    ly += 2;

    leftSection('COMPETENCES');
    d.comp_tech.split(',').forEach(function(c) { leftText('> ' + c.trim()); });
    ly += 2;

    leftSection('LOGICIELS');
    d.comp_log.split(',').forEach(function(c) { leftText('> ' + c.trim()); });
    ly += 2;

    leftSection('LOISIRS');
    d.hobbies.split(',').forEach(function(h) { leftText('> ' + h.trim()); });

    var ry = 15;
    doc.setTextColor(16, 12, 48);
    doc.setFontSize(23); doc.setFont('helvetica', 'bold');
    splitLines(doc, d.nom, mainW).forEach(function(l) { doc.text(l, mainX, ry); ry += 11; });

    doc.setFontSize(11); doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 30, 210);
    doc.text(d.metier, mainX, ry); ry += 5;
    doc.setFontSize(8.5); doc.setTextColor(130, 130, 150);
    doc.text(d.experience + ' ans d\'experience', mainX, ry); ry += 4;

    doc.setDrawColor(100, 30, 210);
    doc.setLineWidth(1);
    doc.line(mainX, ry, mainX + mainW, ry);
    ry += 9;

    function rightSection(label) {
        doc.setTextColor(100, 30, 210);
        doc.setFontSize(9.5); doc.setFont('helvetica', 'bold');
        doc.text(label, mainX, ry);
        doc.setDrawColor(200, 180, 255);
        doc.setLineWidth(0.3);
        doc.line(mainX, ry + 2, mainX + mainW, ry + 2);
        doc.setFont('helvetica', 'normal');
        ry += 9;
    }

    rightSection('PROFIL');
    doc.setTextColor(50, 50, 70); doc.setFontSize(9);
    ry = writeBlock(doc, splitLines(doc, d.presentation, mainW), mainX, ry, 5);
    ry += 8;

    rightSection('EXPERIENCE PROFESSIONNELLE');
    doc.setFontSize(10); doc.setFont('helvetica', 'bold'); doc.setTextColor(16, 12, 48);
    doc.text(d.exp_poste, mainX, ry); ry += 5;
    doc.setFontSize(8); doc.setFont('helvetica', 'italic'); doc.setTextColor(100, 30, 210);
    doc.text(d.exp_periode, mainX, ry); ry += 6;
    doc.setFont('helvetica', 'normal'); doc.setFontSize(9); doc.setTextColor(50, 50, 70);
    ry = writeMissions(doc, d.exp_missions, mainX, ry, 5, mainW);
    ry += 8;

    rightSection('FORMATION');
    doc.setFontSize(10); doc.setFont('helvetica', 'bold'); doc.setTextColor(16, 12, 48);
    doc.text(d.form_diplome, mainX, ry); ry += 5;
    doc.setFontSize(8); doc.setFont('helvetica', 'italic'); doc.setTextColor(100, 30, 210);
    doc.text(d.form_annee, mainX, ry); ry += 9;

    rightSection('APTITUDES');
    doc.setFont('helvetica', 'normal'); doc.setFontSize(9); doc.setTextColor(50, 50, 70);
    ry = writeBlock(doc, splitLines(doc, d.comp_apt, mainW), mainX, ry, 5);

    doc.save('CV_' + d.nom.replace(/\s+/g, '_') + '_Moderne.pdf');
}

function genCreatif(jsPDF, d, photo) {
    var doc = new jsPDF({ unit: 'mm', format: 'a4' });
    var W = 210;
    var lx = 15, cw = 180;


    doc.setFillColor(14, 9, 42);
    doc.rect(0, 0, W, 52, 'F');
    doc.setFillColor(75, 18, 150);
    doc.rect(0, 0, W, 7, 'F');

    if (photo) {
        var photoSize = 30;
        doc.setFillColor(255, 255, 255);
        doc.roundedRect(W - lx - photoSize - 1, 9, photoSize + 2, photoSize + 2, 2, 2, 'F');
        addPhoto(doc, photo, W - lx - photoSize, 10, photoSize, photoSize);
    }

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24); doc.setFont('helvetica', 'bold');
    doc.text(d.nom.toUpperCase(), lx, 23);
    doc.setFontSize(10); doc.setFont('helvetica', 'normal');
    doc.setTextColor(170, 130, 255);
    doc.text(d.metier.toUpperCase() + '  |  ' + d.experience + ' ans', lx, 33);

    /* Barre contact violette */
    doc.setFillColor(100, 30, 210);
    doc.rect(0, 52, W, 11, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(8.5); doc.setFont('helvetica', 'normal');
    doc.text(d.email + '   |   ' + d.telephone + '   |   ' + d.adresse, lx, 59);

    var y = 72;

    function section(label) {
        doc.setFillColor(248, 244, 255);
        doc.rect(lx, y, cw, 8, 'F');
        doc.setFillColor(100, 30, 210);
        doc.rect(lx, y, 3, 8, 'F');
        doc.setTextColor(55, 8, 130);
        doc.setFontSize(9.5); doc.setFont('helvetica', 'bold');
        doc.text(label, lx + 7, y + 5.5);
        doc.setFont('helvetica', 'normal'); doc.setTextColor(50, 50, 50);
        y += 13;
    }

    section('PROFIL PROFESSIONNEL');
    doc.setFontSize(9); doc.setTextColor(50, 50, 70);
    y = writeBlock(doc, splitLines(doc, d.presentation, cw - 4), lx + 4, y, 5);
    y += 8;

    section('EXPERIENCE PROFESSIONNELLE');
    doc.setFillColor(100, 30, 210);
    doc.roundedRect(lx + 4, y - 1, 38, 6, 1.5, 1.5, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(7.5); doc.setFont('helvetica', 'bold');
    doc.text(d.exp_periode, lx + 6, y + 3.2);
    doc.setFontSize(10); doc.setFont('helvetica', 'bold'); doc.setTextColor(30, 8, 70);
    doc.text(d.exp_poste, lx + 46, y + 3.2);
    y += 10;
    doc.setFont('helvetica', 'normal'); doc.setFontSize(9); doc.setTextColor(50, 50, 70);
    y = writeMissions(doc, d.exp_missions, lx + 4, y, 5, cw - 8);
    y += 8;

    section('FORMATION');
    doc.setFillColor(100, 30, 210);
    doc.roundedRect(lx + 4, y - 1, 30, 6, 1.5, 1.5, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(7.5); doc.setFont('helvetica', 'bold');
    doc.text(d.form_annee, lx + 6, y + 3.2);
    doc.setFontSize(10); doc.setFont('helvetica', 'bold'); doc.setTextColor(30, 8, 70);
    doc.text(d.form_diplome, lx + 38, y + 3.2);
    y += 13;

    section('COMPETENCES');
    var halfW = (cw - 8) / 2;
    var cy = y, cy2 = y;

    doc.setFontSize(7.5); doc.setFont('helvetica', 'bold'); doc.setTextColor(100, 30, 210);
    doc.text('TECHNIQUES', lx + 4, cy); cy += 6;
    doc.setFont('helvetica', 'normal'); doc.setFontSize(8.5); doc.setTextColor(50, 50, 70);
    d.comp_tech.split(',').forEach(function(c) { doc.text('- ' + c.trim(), lx + 4, cy); cy += 5; });

    doc.setFontSize(7.5); doc.setFont('helvetica', 'bold'); doc.setTextColor(100, 30, 210);
    doc.text('LOGICIELS', lx + 4 + halfW, cy2); cy2 += 6;
    doc.setFont('helvetica', 'normal'); doc.setFontSize(8.5); doc.setTextColor(50, 50, 70);
    d.comp_log.split(',').forEach(function(c) { doc.text('- ' + c.trim(), lx + 4 + halfW, cy2); cy2 += 5; });

    y = Math.max(cy, cy2) + 4;
    doc.setFontSize(7.5); doc.setFont('helvetica', 'bold'); doc.setTextColor(100, 30, 210);
    doc.text('APTITUDES', lx + 4, y); y += 6;
    doc.setFont('helvetica', 'normal'); doc.setFontSize(8.5); doc.setTextColor(50, 50, 70);
    y = writeBlock(doc, splitLines(doc, d.comp_apt, cw - 8), lx + 4, y, 5);
    y += 8;

    section('LANGUES & LOISIRS');
    var loisirX = lx + cw / 2;
    var lY = y, hY = y;
    doc.setFontSize(7.5); doc.setFont('helvetica', 'bold'); doc.setTextColor(100, 30, 210);
    doc.text('LANGUES', lx + 4, lY); lY += 6;
    doc.setFont('helvetica', 'normal'); doc.setFontSize(8.5); doc.setTextColor(50, 50, 70);
    d.langues.split(',').forEach(function(l) { doc.text('> ' + l.trim(), lx + 4, lY); lY += 5; });

    doc.setFontSize(7.5); doc.setFont('helvetica', 'bold'); doc.setTextColor(100, 30, 210);
    doc.text('LOISIRS', loisirX, hY); hY += 6;
    doc.setFont('helvetica', 'normal'); doc.setFontSize(8.5); doc.setTextColor(50, 50, 70);
    d.hobbies.split(',').forEach(function(h) { doc.text('> ' + h.trim(), loisirX, hY); hY += 5; });

    doc.save('CV_' + d.nom.replace(/\s+/g, '_') + '_Creatif.pdf');
}


function genMinimaliste(jsPDF, d, photo) {
    var doc = new jsPDF({ unit: 'mm', format: 'a4' });
    var W = 210;
    var lx = 22, cw = 166;


    doc.setFillColor(20, 20, 20);
    doc.rect(0, 0, W, 3, 'F');


    if (photo) {
        var photoSize = 28;
        doc.setFillColor(230, 230, 230);
        doc.rect(W - lx - photoSize - 1, 5, photoSize + 2, photoSize + 2, 'F');
        addPhoto(doc, photo, W - lx - photoSize, 6, photoSize, photoSize);
    }

    doc.setTextColor(20, 20, 20);
    doc.setFontSize(28); doc.setFont('helvetica', 'bold');
    doc.text(d.nom.toUpperCase(), lx, 22);

    doc.setFontSize(10.5); doc.setFont('helvetica', 'normal');
    doc.setTextColor(90, 90, 90);
    doc.text(d.metier.toUpperCase(), lx, 30);

    doc.setDrawColor(20, 20, 20);
    doc.setLineWidth(1.2);
    doc.line(lx, 34, W - lx, 34);

    doc.setFontSize(8); doc.setTextColor(110, 110, 110);
    doc.text(d.email + '   |   ' + d.telephone + '   |   ' + d.adresse, lx, 40);
    doc.text('Experience : ' + d.experience + ' ans', W - lx, 40, { align: 'right' });

    var y = 52;

    function section(label) {
        doc.setFontSize(7.5); doc.setFont('helvetica', 'bold');
        doc.setTextColor(160, 160, 160);
        doc.text(label.toUpperCase(), lx, y);
        doc.setDrawColor(210, 210, 210);
        doc.setLineWidth(0.3);
        doc.line(lx, y + 2, W - lx, y + 2);
        doc.setFont('helvetica', 'normal'); doc.setTextColor(40, 40, 40);
        y += 8;
    }

    section('Profil');
    doc.setFontSize(9.5); doc.setTextColor(55, 55, 55);
    y = writeBlock(doc, splitLines(doc, d.presentation, cw), lx, y, 5.5);
    y += 9;

    section('Experience professionnelle');
    doc.setFontSize(8); doc.setFont('helvetica', 'normal'); doc.setTextColor(130, 130, 130);
    doc.text(d.exp_periode, lx, y);
    doc.setFontSize(10); doc.setFont('helvetica', 'bold'); doc.setTextColor(20, 20, 20);
    doc.text(d.exp_poste, lx + 48, y);
    y += 7;
    doc.setFont('helvetica', 'normal'); doc.setFontSize(9); doc.setTextColor(65, 65, 65);
    y = writeMissions(doc, d.exp_missions, lx + 48, y, 5.2, cw - 48);
    y += 9;

    section('Formation');
    doc.setFontSize(8); doc.setFont('helvetica', 'normal'); doc.setTextColor(130, 130, 130);
    doc.text(d.form_annee, lx, y);
    doc.setFontSize(10); doc.setFont('helvetica', 'bold'); doc.setTextColor(20, 20, 20);
    doc.text(d.form_diplome, lx + 48, y);
    y += 11;

    section('Competences');
    var col3W = cw / 3;
    doc.setFontSize(7.5); doc.setFont('helvetica', 'bold'); doc.setTextColor(100, 100, 100);
    doc.text('TECHNIQUES', lx, y);
    doc.text('LOGICIELS', lx + col3W, y);
    doc.text('APTITUDES', lx + col3W * 2, y);
    y += 6;
    doc.setFont('helvetica', 'normal'); doc.setFontSize(8.5); doc.setTextColor(50, 50, 50);
    var y1 = y, y2 = y, y3 = y;
    d.comp_tech.split(',').forEach(function(c) { doc.text('. ' + c.trim(), lx, y1); y1 += 5; });
    d.comp_log.split(',').forEach(function(c) { doc.text('. ' + c.trim(), lx + col3W, y2); y2 += 5; });
    d.comp_apt.split(',').forEach(function(c) { doc.text('. ' + c.trim(), lx + col3W * 2, y3); y3 += 5; });
    y = Math.max(y1, y2, y3) + 9;

    section('Langues & Loisirs');
    var colHalf = cw / 2;
    doc.setFontSize(7.5); doc.setFont('helvetica', 'bold'); doc.setTextColor(100, 100, 100);
    doc.text('LANGUES', lx, y);
    doc.text('LOISIRS', lx + colHalf, y);
    y += 6;
    doc.setFont('helvetica', 'normal'); doc.setFontSize(8.5); doc.setTextColor(50, 50, 50);
    var yL = y, yH = y;
    d.langues.split(',').forEach(function(l) { doc.text('. ' + l.trim(), lx, yL); yL += 5; });
    d.hobbies.split(',').forEach(function(h) { doc.text('. ' + h.trim(), lx + colHalf, yH); yH += 5; });

    doc.setFillColor(20, 20, 20);
    doc.rect(0, 294, W, 3, 'F');

    doc.save('CV_' + d.nom.replace(/\s+/g, '_') + '_Minimaliste.pdf');
}
