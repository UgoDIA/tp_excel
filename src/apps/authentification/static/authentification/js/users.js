$(document).ready(function () {
    const domain = window.location.origin;

    populateUser(domain);
    $('#add-user').click(function () {
        openAddModal('users');
    });
});


function populateUser(domain) {
    $('#usersTable').DataTable({

        ajax: {
            url: domain + '/tp_excel/api/users/',
            dataSrc: ''
        },
        columns: [
            { data: 'username', title: 'Identifiant' },
            { data: 'last_name', title: 'Nom' },
            { data: 'first_name', title: 'Prénom' },
            { data: 'email', title: 'Mail' },

            {
                data: 'groups[0].name',
                title: 'Rôle',
            }
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
                            <button onclick="fetchUser('${domain}',${row.id})" class="btn btn-edit">
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
}


function fetchUser(domain, userId) {
    $.ajax({
        url: domain + '/tp_excel/api/users/' + userId,
        method: 'GET',
        success: function (data) {

            openEditModal('user', 'user', data);
        },
        error: function (error) {
            console.error('Erreur :', error);
        }
    });
}