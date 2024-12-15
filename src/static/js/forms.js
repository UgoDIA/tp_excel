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
    // 
    switch (key) {
        case 'users':
            formHtml = generateUsersFormHtml(key);
            break;
        case 'stats_adel_vip':
            formHtml = generateVIPFormHtml();
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
                        <option value="0">Employé</option>
                    </select>
                </div>
                <button type="button" class="btn btnsubmit" onclick="handleFormAdd('${key}')">Créer</button>
            </form>
        `;
}

/**
 * Génère le HTML du formulaire pour l'agent
 * @returns {string} - Le HTML du formulaire pour l'agent.
 */
function generateVIPFormHtml() {
    return `
        <form id="addForm">
            <div class="row mb-3">
                <div class="">
                    <label for="nom_vip" class="form-label">Nom de la nouvelle liste VIP</label>
                    <input type="text" class="form-control" id="nom_vip" name="nom_vip" required>
                </div>
            </div>
            <div class="row mb-3">
                <div class="col-auto">
                 Diffusion Open Data :
                </div>
                <div class=" col-auto form-check form-switch">
                    <input class="form-check-input" type="checkbox" id="diffusion_open_data" name="diffusion_open_data">
                </div>
    
            </div>
            <button type="button" class="btn btnsubmit mt-3" onclick="handleFormAdd('stats_adel_vip')">Enregistrer</button>
        </form>
    `;
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
        case 'stats_adel_vip':
            return "Ajout d'une nouvelle liste";
        default:
            return 'Ajout';
    }
}


/**
 * gere envoi du formulaire d'ajout
 * @param {string} key - cle qui identifie le formulaire a generer (vp, flux, evt, agence).
 */
function handleFormAdd(key) {
    const form = $('#addForm');
    const form_data = form.serializeArray();
    const domain = window.location.origin;
    const csrftoken = getCookie('csrftoken');
    let url = '';
    let method = 'POST';


    switch (key) {
        case 'stats_adel_vip':
        case 'users':
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

            if (key === 'stats_adel_vip') {
                const vipSelect = $('#vip_select');
                populateListeVIPSelect(domain, vipSelect, response.id);
                histo(domain, 'create', user_nni, null, response.id, data);


            } else if (key === 'users') {
                // histo(domain, 'create', user_nni, response.id, data.id_stats_adel_vip, data);

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
    let apiUrl = domain + '/viping/api/' + key + '/' + id + '/'

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
            formHtml = generateListeVIPEditFormHtml(key, rowData);
            break;
        case 'stats_adel_vip':
            formHtml = generateVIPEditFormHtml(rowData);
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
function generateListeVIPEditFormHtml(key, rowData) {
    return `
        <form id="editForm">
            <div class="row mb-3">
                <div class="col-md-6">
                    <label for="prm" class="form-label">PRM</label>
                    <input type="text" class="form-control" id="prm" name="prm" value="${replaceNull(rowData.prm)}" >
                </div>
                <div class="col-md-6">
                    <label for="edl" class="form-label">EDL</label>
                    <input type="text" class="form-control" id="edl" name="edl" value="${replaceNull(rowData.edl)}" >
                </div>
            </div>
            <div class="row mb-3">
                <div class="col-md-6">
                    <label for="nom_client" class="form-label">Nom</label>
                    <input type="text" class="form-control" id="nom_client" name="nom_client" value="${replaceNull(rowData.nom_client)}" >
                </div>
                <div class="col-md-6">
                    <label for="ref_externe_client" class="form-label">Ref. externe</label>
                    <input type="text" class="form-control" id="ref_externe_client" name="ref_externe_client" value="${replaceNull(rowData.ref_externe_client)}" >
                </div>
            </div>
            <div class="row mb-3">
                <div class="col-md-6">
                    <label for="code_prio" class="form-label">Priorité</label>
                    <select class="form-select" id="code_prio" name="code_prio">
                        <option value="" disabled ${rowData.code_prio === null ? 'selected' : ''}>Sélectionner</option>
                        <option value="1" ${rowData.code_prio == 1 ? 'selected' : ''}>1</option>
                        <option value="2" ${rowData.code_prio == 2 ? 'selected' : ''}>2</option>
                        <option value="3" ${rowData.code_prio == 3 ? 'selected' : ''}>3</option>
                        <option value="4" ${rowData.code_prio == 4 ? 'selected' : ''}>4</option>
                        <option value="5" ${rowData.code_prio == 5 ? 'selected' : ''}>5</option>
                    </select>
                </div>
                <div class="col-md-6">
                    <label for="ordre" class="form-label">Ordre</label>
                    <input type="number" class="form-control" id="ordre" name="ordre" value="${replaceNull(rowData.ordre)}" >
                </div>
            </div>
            <div class="d-flex justify-content-between">
                <button type="button" class="btn btnsubmit" onclick="handleFormEdit('${key}', ${rowData.id_users})">Enregistrer</button>
                <button type="button" class="btn btn-danger" onclick="handleFormDelete('${key}','${rowData.id_users}')" >Supprimer</button>
            </div>
        </form>
    `;
}

/**
 * Génère le HTML du formulaire pour modifier un agent
 * @param {object} rowData - Données de l'agent.
 * @returns {string} - Le HTML du formulaire de modification pour l'agent.
 */
function generateVIPEditFormHtml(rowData) {
    const isChecked = rowData.diffusion_open_data ? 'checked' : '';
    return `
        <form id="editForm">
            <div class="row mb-3">
                <div class="">
                    <label for="nom_vip" class="form-label">Nom de la liste</label>
                    <input type="text" class="form-control" id="nom_vip" name="nom_vip" value="${replaceNull(rowData.nom_vip)}" >
                </div>
            </div>
            <div class="row mb-4">
                <div class="col-auto">
                 Diffusion Open Data :
                </div>
                <div class=" col-auto form-check form-switch">
                    <input class="form-check-input" type="checkbox" id="diffusion_open_data" name="diffusion_open_data" ${isChecked}>
                </div>
    
            </div>
          
            <div class="d-flex justify-content-between">
                <button type="button" class="btn btnsubmit mx-5" onclick="handleFormEdit('stats_adel_vip', ${rowData.id_stats_adel_vip})">Enregistrer</button>
                <button type="button" class="btn btn-danger mx-5" onclick="handleFormDelete('stats_adel_vip','${rowData.id_stats_adel_vip}')">Supprimer</button>
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
            return "Modification d'une ligne";
        case 'stats_adel_vip':
            return "Modification d'une liste";
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
    if (key === 'users') {
        let prmValue = $('#prm').val().trim();
        let edlValue = $('#edl').val().trim();
        if (!prmValue && !edlValue) {
            hasInvalidField = true;
            $('#prm, #edl').addClass('is-invalid');
            $('#edl').after('<div class="invalid-feedback">Au moins un de ces champs est requis.</div>');
        }
    }

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
    if (key === 'stats_adel_vip') {
        data.diffusion_open_data = $('#diffusion_open_data').is(':checked');
    }



    switch (key) {
        case 'users':
        case 'stats_adel_vip':
        case 'poste_depart':
            url = `${domain}/viping/api/${key}/${id}/`;
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

            if (key === 'stats_adel_vip') {
                const vipSelect = $('#vip_select');
                populateListeVIPSelect(domain, vipSelect, id);
                histo(domain, 'update', user_nni, null, id, data);
            } else if (key === 'users') {
                let selectedVIP = $('#vip_select').val();
                histo(domain, 'update', user_nni, id, selectedVIP, data);
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
        case 'stats_adel_vip':
            url = `${domain}/viping/api/${key}/${id}/`;
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

                if (key === 'stats_adel_vip') {
                    const vipSelect = $('#vip_select');
                    populateListeVIPSelect(domain, vipSelect);
                    $('#addListeVIP').hide();
                    // $('#ImportDiv').hide();
                    $('#editVIP').hide();
                    $('#deleteVIP').hide();
                    $('#liste_vipTable').DataTable().destroy();
                    $('#liste_vipTable').hide();
                    $('#export').hide();
                    $('#borderTable').hide();
                    $('#hr2').hide();
                    $('#vipText').empty();
                    histo(domain, 'delete', user_nni, null, id);

                } else if (key === 'users') {
                    let selectedVIP = $('#vip_select').val();
                    histo(domain, 'delete', user_nni, id, selectedVIP);
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
    const url = domain + '/viping/api/stats_adel_histo/';
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

function check_maj() {
    const domain = window.location.origin;
    const majVizButton = $('#maj_viz');
    $.ajax({
        url: domain + '/viping/api/query/get_maj_viz/',
        type: 'GET',
        success: function (response) {
            if (response.length > 0) {
                majVizButton.show();
                console.log("Mise à jour disponible");
            } else {
                console.log("Aucune mise à jour disponible");
                majVizButton.hide();
            }
        },
        error: function (xhr, status, error) {
            console.error("Erreur lors de la vérification de la mise à jour:", error);
            majVizButton.hide();
        }
    });
}
