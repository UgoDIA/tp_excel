$(document).ready(function () {
    const domain = window.location.origin;
    populateCourse(domain);
    populateCategorie(domain);
    populateCoureur(domain)
    $('#add-course').click(function () {
        openAddModal('course');
    });
    $('#add-categorie').click(function () {
        openAddModal('categorie');
    });
    $('#add-coureur').click(function () {
        openAddModal('coureur');
    });
});


function populateCourse(domain) {
    $('#courseTable').DataTable({

        ajax: {
            url: domain + '/tp_excel/api/course/',
            dataSrc: ''
        },
        columns: [
            { data: 'nom', title: 'Nom Course' },
            { data: 'prix_15', title: 'Prix -15%' },
            { data: 'prix_20', title: 'Prix -20%' },
        ],

        language: { url: fr_url },
        autoWidth: true,
        responsive: true,
        pageLength: 10,
        lengthMenu: [10, 20, 50],
        columnDefs: [
            {
                targets: [0],
                render: function (data, type, row) {
                    if (type === 'display' || type === 'filter') {
                        const button = `
                            <button class="btn btn-edit course-link" data-id="${row.id_course}" data-key="course">
                                <img src="/static/images/edit.png" class="mx-1 py-1" style="max-height: 30px;">
                            </button>
                        `;
                        return button + ' ' + data;
                    }
                    return data;
                }
            },
            {
                targets: [1, 2],
                render: function (data, type, row) {
                    if (type === 'display' || type === 'filter') {
                        return data + ' €';
                    }
                    return data;
                }
            },
            {
                className: "dt-center",
                targets: "_all"
            }
        ]
    });
    $('#courseTable').on('click', '.course-link', function () {
        const idLabel = $(this).data('id');
        const key = $(this).data('key');
        fetchOne(domain, key, idLabel);
    });
}

function populateCategorie(domain) {
    $('#categorieTable').DataTable({
        ajax: {
            url: domain + '/tp_excel/api/categorie/',
            dataSrc: ''
        },
        columns: [
            { data: 'annee', title: 'Année' },
            { data: 'code_categorie', title: 'Catégorie' }
        ],

        language: { url: fr_url },
        autoWidth: true,
        responsive: true,
        pageLength: 10,
        lengthMenu: [10, 20, 50],
        columnDefs: [
            {
                targets: [0],
                render: function (data, type, row) {
                    if (type === 'display' || type === 'filter') {
                        const year = data.split('-')[0];
                        const button = `
                            <button class="btn btn-edit categorie-link" data-id="${row.id_categorie}" data-key="categorie">
                                <img src="/static/images/edit.png" class="mx-1 py-1" style="max-height: 30px;">
                            </button>
                        `;
                        return button + ' ' + year;
                    }
                    return data;
                }
            },
            {
                className: "dt-center",
                targets: "_all"
            }
        ]
    });

    $('#categorieTable').on('click', '.categorie-link', function () {
        const idLabel = $(this).data('id');
        const key = $(this).data('key');
        fetchOne(domain, key, idLabel);
    });
}

function populateCoureur(domain) {
    $('#coureurTable').DataTable({
        ajax: {
            url: domain + '/tp_excel/api/coureur/',
            dataSrc: ''
        },
        columns: [
            { data: 'nom', title: 'Nom' },
            { data: 'prenom', title: 'Prénom' },
            { data: 'sexe', title: 'Sexe' },
            { data: 'date_de_naissance', title: 'Date de Naissance' },
            { data: 'categorie.code_categorie', title: 'Catégorie' },
            { data: 'taille_tee_shirt', title: 'Taille T-Shirt' },
            { data: 'course.nom', title: 'Nom de la Course' },
            { data: 'repas_avant_course', title: 'Repas Avant Course' },
            { data: 'repas_apres_course', title: 'Repas Après Course' },
            { data: 'total_coureur', title: 'Total Coureur (€)' }
        ],

        language: { url: fr_url },
        autoWidth: true,
        responsive: true,
        pageLength: 10,
        lengthMenu: [10, 20, 50],
        columnDefs: [
            {
                targets: [7],
                render: function (data, type, row) {
                    if (type === 'display' || type === 'filter') {
                        return data ? 'Oui' : 'Non';
                    }
                    return data;
                }
            },
            {
                targets: [8],
                render: function (data, type, row) {
                    if (type === 'display' || type === 'filter') {
                        return data ? 'Oui' : 'Non';
                    }
                    return data;
                }
            },
            {
                targets: [9],
                render: function (data, type, row) {
                    if (type === 'display' || type === 'filter') {
                        return `${parseFloat(data).toFixed(2)} €`;
                    }
                    return data;
                }
            },
            {
                targets: [0],
                render: function (data, type, row) {
                    if (type === 'display' || type === 'filter') {
                        const button = `
                            <button class="btn btn-edit coureur-link" data-id="${row.id_coureur}" data-key="coureur">
                                <img src="/static/images/edit.png" class="mx-1 py-1" style="max-height: 30px;">
                            </button>
                        `;
                        return button + ' ' + data;
                    }
                    return data;
                }
            },
            {
                className: "dt-center",
                targets: "_all"
            }
        ]
    });

    $('#coureurTable').on('click', '.coureur-link', function () {
        const idLabel = $(this).data('id');
        const key = $(this).data('key');
        fetchOne(domain, key, idLabel);
    });
}


function fetchRunnersDataAndTotal() {
    $.ajax({
        url: `${window.location.origin}/tp_excel/api/coureur/`,
        method: 'GET',
        success: function (data) {
            const raceCounts = {};
            let totalAmount = 0;

          
            data.forEach(runner => {
             
                const courseName = runner.course.nom;
                if (raceCounts[courseName]) {
                    raceCounts[courseName]++;
                } else {
                    raceCounts[courseName] = 1;
                }

         
                totalAmount += parseFloat(runner.total_coureur);
            });

      
            displayRaceCounts(raceCounts);

       
            displayTotalAmount(totalAmount);
        },
        error: function (error) {
            console.error('Error fetching runners data:', error);
         
        }
    });
}


function displayRaceCounts(raceCounts) {
    const tbody = $('#runnersTable tbody');
    tbody.empty();

    for (const [courseName, count] of Object.entries(raceCounts)) {
        const rowHtml = `
            <tr>
                <td>${courseName}</td>
                <td>${count}</td>
            </tr>
        `;
        tbody.append(rowHtml);
    }
}


function displayTotalAmount(totalAmount) {
    const tbody = $('#totalCoureurTable tbody');
    tbody.empty(); 

    const rowHtml = `
        <tr>
            <td>${totalAmount.toFixed(2)} €</td> <!-- Format as currency -->
        </tr>
    `;
    tbody.append(rowHtml); 
}

$(document).ready(function () {
    fetchRunnersDataAndTotal();
});