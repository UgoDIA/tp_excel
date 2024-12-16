/**
 * Ouvre le modal formulaire d'ajout en fonction de la clé
 * @param {string} key - identifie le formulaire à générer (vp, flux, evt).
 */
function openAddModal(key) {
    const formHtml = generateFormHtml(key);
    const modalTitle = getModalTitle(key);
    $('#modalTitle').text(modalTitle);
    $('.modal-body').html(formHtml);
    $('#modalForm').modal('show');
}

/**
 * Génère le HTML du formulaire basé sur la clé
 * @param {string} key - Identifiant du formulaire.
 * @returns {string} - Le HTML du formulaire.
 */
function generateFormHtml(key) {
    let formHtml = '';
    switch (key) {
        case 'users':
            formHtml = generateUsersFormHtml(key);
            break;
        case 'course':
            formHtml = generateCourseFormHtml(key);
            break;
        case 'categorie':
            formHtml = generateCategorieFormHtml(key);
            break;
        case 'coureur':
            formHtml = generateCoureurFormHtml(key);
            break;
        default:
            formHtml = '<p>Formulaire non défini.</p>';
    }

    return formHtml;
}




/**
 * Génère le HTML du formulaire pour la liste vip
 * @returns {string} - Le HTML du formulaire pour liste vip
 */
function generateUsersFormHtml(key) {
    return `
          <form id="addForm">
                <div class="mb-3">
                    <label for="username" class="form-label">Identifiant</label>
                    <input type="text" class="form-control" id="username" name="username" required>
                </div>
                <div class="mb-3">
                    <label for="first_name" class="form-label">Prénom</label>
                    <input type="text" class="form-control" id="first_name" name="first_name" required>
                </div>
                <div class="mb-3">
                    <label for="last_name" class="form-label">Nom</label>
                    <input type="text" class="form-control" id="last_name" name="last_name" required>
                </div>
                <div class="mb-3">
                    <label for="email" class="form-label">Mail</label>
                     <input type="email" class="form-control" id="email" name="email" required>
                    </select>
                </div>
                <div class="mb-3">
                    <label for="groups" class="form-label">Rôle</label>
                    <select class="form-select" id="groups" name="groups" required>
                        <option value="" disabled selected>Sélectionner</option>
                        <option value="1">Admin</option>
                        <option value="2">Employé</option>
                    </select>
                </div>
                <button type="button" class="btn btnsubmit" onclick="handleFormAdd('${key}')">Créer</button>
            </form>
        `;
}

/**
 * Génère le HTML du formulaire pour ajouter une course
 * @returns {string} - Le HTML du formulaire pour ajouter une course
 */
function generateCourseFormHtml(key) {
    return `
        <form id="addForm">
            <div class="mb-3">
                <label for="nom" class="form-label">Nom de la Course</label>
                <input type="text" class="form-control" id="nom" name="nom" required>
            </div>
            <div class="mb-3">
                <label for="prix_15" class="form-label">Prix -15%</label>
                <input type="number" step="0.01" class="form-control" id="prix_15" name="prix_15" required>
            </div>
            <div class="mb-3">
                <label for="prix_20" class="form-label">Prix -20%</label>
                <input type="number" step="0.01" class="form-control" id="prix_20" name="prix_20" required>
            </div>
            <button type="button" class="btn btnsubmit" onclick="handleFormAdd('${key}')">Créer</button>
        </form>
    `;
}

function generateCategorieFormHtml(key) {
    return `
        <form id="addForm">
            <div class="mb-3">
                <label for="annee" class="form-label">Année</label>
                <input type="number" class="form-control" id="annee" name="annee" required>
            </div>
            <div class="mb-3">
                <label for="code_categorie" class="form-label">Code Catégorie</label>
                <input type="text" class="form-control" id="code_categorie" name="code_categorie" required>
            </div>
            <button type="button" class="btn btnsubmit" onclick="handleFormAdd('${key}')">Créer</button>
        </form>
    `;
}

function generateCoureurFormHtml(key) {
    $.ajax({
        url: `${window.location.origin}/tp_excel/api/course/`,
        method: 'GET',
        success: function (coursesResponse) {
            $.ajax({
                url: `${window.location.origin}/tp_excel/api/categorie/`,
                method: 'GET',
                success: function (categoriesResponse) {

                    let courseOptions = coursesResponse.map(course => {
                        return `<option value="${course.id_course}">${course.nom}</option>`;
                    }).join('');


                    const formHtml = `
                        <form id="addForm">
                        
                            <div class="row mb-3">
                                <div class="col">
                                    <label for="nom" class="form-label">Nom</label>
                                    <input type="text" class="form-control" id="nom" name="nom" required>
                                </div>
                                <div class="col">
                                    <label for="prenom" class="form-label">Prénom</label>
                                    <input type="text" class="form-control" id="prenom" name="prenom" required>
                                </div>
                            </div>

                       
                            <div class="row mb-3">
                                <div class="col">
                                    <label for="sexe" class="form-label">Sexe</label>
                                    <select class="form-select" id="sexe" name="sexe" required>
                                        <option value="" disabled selected>Sélectionner</option>
                                        <option value="M">Masculin</option>
                                        <option value="F">Féminin</option>
                                        <option value="Autre">Autre</option>
                                    </select>
                                </div>
                                <div class="col">
                                    <label for="date_de_naissance" class="form-label">Date de naissance</label>
                                    <input type="date" class="form-control" id="date_de_naissance" name="date_de_naissance" required onchange="setCategorieFromDate()">
                                </div>
                            </div>

                            <div class="row mb-3">
                                <div class="col">
                                    <label for="id_course" class="form-label">Course</label>
                                    <select class="form-select" id="id_course" name="id_course" onchange="calculateTotalCoureur()" required>
                                        <option value="" disabled selected>Choisir une course</option>
                                        ${courseOptions}
                                    </select>
                                </div>
                                <div class="col">
                                    <label for="taille_tee_shirt" class="form-label">Taille de T-shirt</label>
                                    <select class="form-select" id="taille_tee_shirt" name="taille_tee_shirt" required>
                                        <option value="" disabled selected>Choisir une taille</option>
                                        <option value="S">S</option>
                                        <option value="M">M</option>
                                        <option value="L">L</option>
                                        <option value="XL">XL</option>
                                    </select>
                                </div>
                            </div>

                            <div class="row mb-3">
                                <div class="col">
                                    <label for="repas_avant_course" class="form-label">Repas avant course</label>
                                    <select class="form-select" id="repas_avant_course" name="repas_avant_course" onchange="calculateTotalCoureur()" required>
                                        <option value="" disabled selected>Sélectionner</option>
                                        <option value="true">Oui</option>
                                        <option value="false">Non</option>
                                    </select>
                                </div>
                                <div class="col">
                                    <label for="repas_apres_course" class="form-label">Repas après course</label>
                                    <select class="form-select" id="repas_apres_course" name="repas_apres_course" onchange="calculateTotalCoureur()" required>
                                        <option value="" disabled selected>Sélectionner</option>
                                        <option value="true">Oui</option>
                                        <option value="false">Non</option>
                                    </select>
                                </div>
                            </div>

                       
                            <div class="row mb-3">
                                <div class="col">
                                    <label for="categorie" class="form-label">Catégorie</label>
                                    <input type="text" class="form-control" id="categorie" name="categorie" disabled>
                                </div>
                                <input type="hidden" id="id_categorie" name="id_categorie">

                            </div>
                           <div class="row mb-3">
                                <div class="col">
                                    <label for="total_prix" class="form-label">Total à Payer</label>
                                    <input type="text" class="form-control" id="total_prix" name="total_prix" disabled>
                                </div>
                                <input type="hidden" id="total_coureur" name="total_coureur">
                            </div>

                            <div class="d-flex justify-content-between">
                                <button type="button" class="btn btnsubmit" onclick="handleFormAdd('${key}')">Créer</button>
                            </div>
                        </form>
                    `;


                    $('.modal-body').html(formHtml);

                    window.setCategorieFromDate = function () {
                        const dateDeNaissance = $('#date_de_naissance').val();
                        if (dateDeNaissance) {
                            const birthYear = new Date(dateDeNaissance).getFullYear();

                            const matchingCategorie = categoriesResponse.find(categorie => {

                                const categorieYear = parseInt(categorie.annee, 10);
                                return categorieYear == birthYear;
                            });

                            if (matchingCategorie) {
                                $('#categorie').val(matchingCategorie.code_categorie);
                                $('#id_categorie').val(matchingCategorie.id_categorie);
                            }
                        }
                    };
                    window.calculateTotalCoureur = function () {
                        const idCourse = $('#id_course').val();
                        const repasAvant = $('#repas_avant_course').val();
                        const repasApres = $('#repas_apres_course').val();
                        console.log(idCourse, repasAvant, repasApres);

                        const selectedCourse = coursesResponse.find(course => course.id_course == idCourse);
                        if (!selectedCourse) {
                            $('#total_prix').val('');
                            $('#total_prix').val('');
                            return;
                        }

                        const prixBase = parseFloat(selectedCourse.prix_15);

                        if (idCourse && repasAvant !== null && repasApres !== null) {
                            let total = prixBase;


                            if (repasAvant === 'true') total += 8;


                            if (repasApres === 'true') total += 10;


                            $('#total_prix').val(total.toFixed(2));
                            $('#total_coureur').val(total.toFixed(2));
                        } else {

                            $('#total_prix').val('');
                            $('#total_coureur').val('');
                        }
                    };

                },
                error: function (error) {
                    console.error('Erreur lors de la récupération des données de catégorie:', error);
                    showAlert('Erreur lors de la récupération des données de catégorie.', 'danger');
                }
            });
        },
        error: function (error) {
            console.error('Erreur lors de la récupération des données de course:', error);
            showAlert('Erreur lors de la récupération des données de course.', 'danger');
        }
    });
}



/**
 * Obtient le titre du modal basé sur la clé
 * @param {string} key - Identifiant du formulaire.
 * @returns {string} - Le titre du modal.
 */
function getModalTitle(key) {
    switch (key) {
        case 'users':
            return "Ajout d'un nouveau vip";
        case 'course':
            return "Ajout d'une nouvelle course";
        case 'categorie':
            return "Ajout d'une nouvelle catégorie";
        case 'coureur':
            return "Ajout d'un nouveau coureur/ nouvelle coureuse";
        default:
            return 'Ajout';
    }
}


/**
 * gere envoi du formulaire d'ajout
 * @param {string} key - cle qui identifie le formulaire a generer.
 */
function handleFormAdd(key) {
    const form = $('#addForm');
    const form_data = form.serializeArray();
    const domain = window.location.origin;
    const csrftoken = getCookie('csrftoken');
    let url = '';
    let method = 'POST';


    switch (key) {
        case 'course':
        case 'users':
        case 'categorie':
        case 'coureur':
            url = `${domain}/tp_excel/api/${key}/`;
            break;
        default:
            return;
    }

    form.find('.invalid-feedback').remove();
    form.find('.is-invalid').removeClass('is-invalid');

    let hasInvalidField = false;

    form.find('input, select, textarea').each(function () {
        let value = $(this).val();
        const isRequired = $(this).is('[required]');
        console.log(value);

        if (typeof value === 'string') {
            value = value.trim();
        }
        if (value === '') {
            value = null;
        }

        $(this).val(value);

        if (isRequired && value === null) {
            hasInvalidField = true;
            $(this).addClass('is-invalid');
            $(this).after('<div class="invalid-feedback">Ce champ est requis.</div>');
        }
    });

    if (hasInvalidField) {
        return;
    }

    let data = {};

    form_data.forEach(item => {
        data[item.name] = item.value === '' ? null : item.value;
    });
    if (data.groups) {
        data.groups = [parseInt(data.groups)];
    }
    if (data.annee) {
        const year = parseInt(data.annee);
        data.annee = `${year}-01-01`;
    }
    $.ajax({
        url: url,
        method: method,
        data: JSON.stringify(data),
        contentType: 'application/json',
        headers: {
            "X-CSRFToken": csrftoken
        },
        success: function (response) {
            showAlert('Ajout enregistré avec succès.', 'success');
            console.log('ajout ok')
            table_id = key + 'Table'
            $('#modalForm').modal('hide');
            $('#' + table_id).DataTable().ajax.reload(null, false);

            if (key === 'course') {


            } else if (key === 'users') {

            }

        },
        error: function (error) {
            showAlert('Erreur lors de l\'ajout.', 'danger');
            $('#modalForm').modal('hide');
            console.error('Erreur lors de l\'ajout:', error);
        }
    });
}

function fetchOne(domain, key, id) {
    let apiUrl = domain + '/tp_excel/api/' + key + '/' + id + '/'

    $.ajax({
        url: apiUrl,
        method: 'GET',
        success: function (data) {
            console.log(data)
            openEditModal(key, data);
        },
        error: function (error) {
            console.error('Erreur :', error);
        }
    });
}

/**
 * Ouvre le modal formulaire de modification en fonction de la clé
 * @param {string} key - identifie le formulaire à générer (vp, flux, evt).
 * @param {object} rowData - Données de la ligne à modifier.
 */
function openEditModal(key, rowData) {
    const formHtml = generateEditFormHtml(key, rowData);
    const modalTitle = getEditModalTitle(key);
    $('#modalTitle').text(modalTitle);
    $('.modal-body').html(formHtml);
    $('#modalForm').modal('show');
}

/**
 * Génère le HTML du formulaire de modification basé sur la clé
 * @param {string} key - Identifiant du formulaire.
 * @param {object} rowData - Données de la ligne à modifier.
 * @returns {string} - Le HTML du formulaire de modification.
 */
function generateEditFormHtml(key, rowData) {
    let formHtml = '';
    switch (key) {
        case 'users':
            formHtml = generateUserEditFormHtml(key, rowData);
            break;
        case 'course':
            formHtml = generateCourseEditFormHtml(key, rowData);
            break;
        case 'categorie':
            formHtml = generateCategorieEditFormHtml(key, rowData);
            break;
        default:
            formHtml = '<p>Formulaire non défini pour l\'édition.</p>';
    }
    return formHtml;
}

/**
 * Génère le HTML du formulaire pour modifier une commune
 * @param {object} rowData - Données de la commune.
 * @returns {string} - Le HTML du formulaire de modification pour la commune.
 */
function generateUserEditFormHtml(key, rowData) {
    return `
        <form id="editForm">
              <div class="mb-3">
                <label for="username" class="form-label">Identifiant</label>
                <input type="text" class="form-control" id="username" name="username" value="${replaceNull(rowData.username)}" required>
            </div>
            <div class="mb-3">
                <label for="first_name" class="form-label">Prénom</label>
                <input type="text" class="form-control" id="first_name" name="first_name" value="${replaceNull(rowData.first_name)}" required>
            </div>
            <div class="mb-3">
                <label for="last_name" class="form-label">Nom</label>
                <input type="text" class="form-control" id="last_name" name="last_name" value="${replaceNull(rowData.last_name)}" required>
            </div>
            <div class="mb-3">
                <label for="email" class="form-label">Mail</label>
                <input type="email" class="form-control" id="email" name="email" value="${replaceNull(rowData.email)}" required>
            </div>
            <div class="mb-3">
                <label for="groups" class="form-label">Rôle</label>
                <select class="form-select" id="groups" name="groups" required>
                    <option value="" disabled ${rowData.groups === null ? 'selected' : ''}>Sélectionner</option>
                    <option value="1" ${rowData.groups == 1 ? 'selected' : ''}>Admin</option>
                    <option value="2" ${rowData.groups == 2 ? 'selected' : ''}>Employé</option>
                </select>
            </div>
            <div class="d-flex justify-content-between">
                <button type="button" class="btn btnsubmit" onclick="handleFormEdit('${key}', ${rowData.id})">Enregistrer</button>
                <button type="button" class="btn btn-danger" onclick="handleFormDelete('${key}', ${rowData.id})">Supprimer</button>
            </div>
        </form>
    `;
}

function generateCourseEditFormHtml(key, rowData) {
    return `
        <form id="editForm">
            <div class="mb-3">
                <label for="nom" class="form-label">Nom de la Course</label>
                <input type="text" class="form-control" id="nom" name="nom" value="${replaceNull(rowData.nom)}" required>
            </div>
            <div class="mb-3">
                <label for="prix_15" class="form-label">Prix -15%</label>
                <input type="number" step="0.01" class="form-control" id="prix_15" name="prix_15" value="${replaceNull(rowData.prix_15)}" required>
            </div>
            <div class="mb-3">
                <label for="prix_20" class="form-label">Prix -20%</label>
                <input type="number" step="0.01" class="form-control" id="prix_20" name="prix_20" value="${replaceNull(rowData.prix_20)}" required>
            </div>
            <div class="d-flex justify-content-between">
                <button type="button" class="btn btnsubmit" onclick="handleFormEdit('${key}', ${rowData.id_course})">Enregistrer</button>
                <button type="button" class="btn btn-danger" onclick="handleFormDelete('${key}', ${rowData.id_course})">Supprimer</button>
            </div>
        </form>
    `;
}

function generateCategorieEditFormHtml(key, rowData) {
    return `
        <form id="editForm">
            <div class="mb-3">
                <label for="annee" class="form-label">Année</label>
                <input type="number" class="form-control" id="annee" name="annee" value="${replaceNull(rowData.annee ? rowData.annee.split('-')[0] : '')}" required>
            </div>
            <div class="mb-3">
                <label for="code_categorie" class="form-label">Code Catégorie</label>
                <input type="text" class="form-control" id="code_categorie" name="code_categorie" value="${replaceNull(rowData.code_categorie)}" required>
            </div>
            <div class="d-flex justify-content-between">
                <button type="button" class="btn btnsubmit" onclick="handleFormEdit('${key}', ${rowData.id_categorie})">Enregistrer</button>
                <button type="button" class="btn btn-danger" onclick="handleFormDelete('${key}', ${rowData.id_categorie})">Supprimer</button>
            </div>
        </form>
    `;
}



/**
 * Obtient le titre du modal de modification basé sur la clé
 * @param {string} key - Identifiant du formulaire.
 * @returns {string} - Le titre du modal.
 */
function getEditModalTitle(key) {
    switch (key) {
        case 'users':
            return "Modification d'une utilisateur";
        case 'course':
            return "Modification d'une course";
        case 'categorie':
            return "Modification d'une catégorie";
        default:
            return 'Modification';
    }
}


/**
 * gere envoi du formulaire edit.
 * @param {string} key - cle qui identifie le formulaire a generer
 * @param {number} [id] - permet de recuperer les donnees de la ligne selectionnee 

 */
function handleFormEdit(key, id) {
    const form = $('#editForm');
    const form_data = form.serializeArray();
    const domain = window.location.origin;
    var csrftoken = getCookie('csrftoken');
    let url = '';
    let method = 'PUT';
    let hasInvalidField = false;

    form.find('input, select').each(function () {
        let value = $(this).val();
        const isRequired = $(this).is('[required]');
        console.log(value);

        if (typeof value === 'string') {
            value = value.trim();
        }
        if (value === '') {
            value = null;
        }

        $(this).val(value);

        if (isRequired && value === null) {
            hasInvalidField = true;
            $(this).addClass('is-invalid');
            $(this).after('<div class="invalid-feedback">Ce champ est requis.</div>');
        }
    });

    if (hasInvalidField) {
        return;
    }

    let data = {};

    form_data.forEach(item => {
        data[item.name] = item.value === '' ? null : item.value;
    });
    if (data.groups) {
        data.groups = [parseInt(data.groups)];
    }
    if (data.annee) {
        const year = parseInt(data.annee);
        data.annee = `${year}-01-01`;
    }

    switch (key) {
        case 'users':
        case 'course':
        case 'categorie':
            url = `${domain}/tp_excel/api/${key}/${id}/`;
            break;
        default:
            return;
    }


    $.ajax({
        url: url,
        method: method,
        data: JSON.stringify(data),
        contentType: 'application/json',
        headers: {
            "X-CSRFToken": csrftoken
        },
        success: function (response) {
            showAlert('Modifications enregistrées avec succès.', 'success');
            $('#modalForm').modal('hide');
            table_id = key + 'Table'
            $('#' + table_id).DataTable().ajax.reload(null, false);

            if (key === 'course') {

            } else if (key === 'users') {

            }
        },
        error: function (error) {
            showAlert('Erreur lors de l\'enregistrement des modifications.', 'danger');
            console.error('Erreur lors de l\'enregistrement des modifications:', error);
        }
    });
}

/**
 * gere suppression
 * @param {string} key - cle qui identifie la table (param_vp, param_flux, evt)
 * @param {number} id - cle qui identifie la l'id de la ligne
 */
function handleFormDelete(key, id) {
    const domain = window.location.origin;
    var csrftoken = getCookie('csrftoken');
    let url = '';
    let method = 'DELETE';

    switch (key) {
        case 'users':
        case 'course':
        case 'categorie':
            url = `${domain}/tp_excel/api/${key}/${id}/`;
            break;
        default:
            return;
    }

    if (confirm('Êtes-vous sûr de vouloir supprimer cet élément ?')) {
        $.ajax({
            url: url,
            method: method,
            headers: {
                "X-CSRFToken": csrftoken
            },
            success: function (response) {
                showAlert('Enregistrement supprimé avec succès.', 'success');
                $('#modalForm').modal('hide');
                table_id = key + 'Table'
                $('#' + table_id).DataTable().ajax.reload(null, false);

                if (key === 'course') {


                } else if (key === 'users') {

                }

            },
            error: function (error) {
                showAlert('Erreur lors de la suppression de l\'enregistrement.', 'danger');
                console.error('Erreur lors de la suppression de l\'enregistrement:', error);
            }
        });
    } else {

        console.log('Suppression annulée');
    }
}




/**
 * permet de retrouver la valeur d'un cookie, sera appelé dans toutes les requetes ajax pour le CSRF
 * @param {string} name - nom du cookie
 * @returns {string|null} valeur du cookie, null si vide
 */
function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = cookies[i].trim();

            if (cookie.substring(0, name.length + 1) === (name + '=')) {

                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}



function replaceNull(value) {
    return value === null ? '' : value;
}

/**
 * genere message d'alerte bootstrap a l'interieur d'un placeholder
 * @param {string} message - message de l'alerte
 * @param {string} type - couleur de l'alerte bootstrap (success, danger, etc.)
 */
function showAlert(message, type) {
    const alertPlaceholder = $('.alertPlaceholder');
    const alertHtml = `
        <div class="alert alert-${type} alert-dismissible fade show" role="alert">
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
    `;
    alertPlaceholder.html(alertHtml);

    setTimeout(function () {
        const alertElement = $('.alert');
        if (alertElement.length) {
            alertElement.alert('close');
        }
    }, 4000);
}

/**
 * enregistre saisies dans la table histo_saisies
 * @param {string} domain - url du domaine
 * @param {string} action - type d'action
 * @param {number} user - nni de l'utilisateur
 * @param {string} id_item - id de l'item
 * @param {string} id_liste - id de la liste
 * @param {string} valeur -valeur de la saisie
 */
function histo(domain, action, user, id_item = null, id_liste = null, valeur = null) {
    console.log(valeur)
    const url = domain + '/tp_excel/api/stats_adel_histo/';
    const csrftoken = getCookie('csrftoken');

    if (valeur !== null && typeof valeur !== 'string') {
        valeur = JSON.stringify(valeur);
    }

    const data = {
        action: action,
        nni: user,
        valeur: valeur === null ? null : valeur,
        id_item: id_item,
        id_liste: id_liste,

    };

    $.ajax({
        url: url,
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(data),
        headers: {
            "X-CSRFToken": csrftoken
        },
        success: function (response) {
            console.log('Histo enregistré avec succés:', response);
            check_maj()
        },
        error: function (error) {
            console.error('Erreur enregistrement histo', error);

        }
    });
}
