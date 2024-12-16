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
                            <button class="btn btn-edit user-link" data-id="${row.id}" data-key="users">
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
    $('#usersTable').on('click', '.user-link', function () {
        const idLabel = $(this).data('id');
        const key = $(this).data('key');
        fetchOne(domain, key, idLabel);  
    });
}


function fetchUser(domain, userId) {
    $.ajax({
        url: domain + '/tp_excel/api/users/' + userId,
        method: 'GET',
        success: function (data) {

            openEditModal('users', data);
        },
        error: function (error) {
            console.error('Erreur :', error);
        }
    });
}