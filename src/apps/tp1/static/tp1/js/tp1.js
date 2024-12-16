
$(document).ready(function () {
    const domain = window.location.origin;
    const container = document.getElementById('table_calc_simple');


    // Initialize Handsontable
    const hot = new Handsontable(container, {
        data: [], // Initial empty data
        colHeaders: ['Produit', 'Nb Achats', 'Nb Ventes', 'Prix Unitaire', 'Stock', 'Chiffre d\'affaires', 'Actions'],
        columns: [
            { data: 'produit', type: 'text', className: 'htCenter' },
            { data: 'nb_achats', type: 'numeric', className: 'htCenter' },
            { data: 'nb_ventes', type: 'numeric', className: 'htCenter' },
            { data: 'prix_unitaire', type: 'numeric', numericFormat: { pattern: '0,0.00' }, className: 'htCenter' },
            { data: 'stock', type: 'numeric', readOnly: true, className: 'htCenter' },
            { data: 'ca', type: 'numeric', readOnly: true, numericFormat: { pattern: '0,0.00' }, className: 'htCenter' },
            {
                data: null,
                renderer: function (instance, td, row, col, prop, value, cellProperties) {
                    const id = instance.getSourceDataAtRow(row).id_calc_simple;
                    td.innerHTML = `<button class="delete-btn" data-id="${id}">-</button>`;
                },
                readOnly: true,
            },


        ],
        rowHeaders: false,
        licenseKey: 'non-commercial-and-evaluation',
        autoColumnSize: true,
        stretchH: 'none',
        afterLoadData: function () {
            bindDeleteButtonEvents(); // Ensure delete buttons are bound after data load
        },
        afterChange: function (changes, source) {
            if (source === 'edit') { // Only act on user edits
                changes.forEach(([row, prop, oldValue, newValue]) => {
                    const updatedRow = hot.getSourceDataAtRow(row); // Get the full row data
                    const itemId = updatedRow.id_calc_simple; // Extract the item ID

                    // Check if the column being updated is either nb_achats or nb_ventes
                    if (prop === 'nb_achats' || prop === 'nb_ventes') {
                        // Update the stock value when nb_achats or nb_ventes changes
                        const nbAchats = updatedRow.nb_achats || 0;
                        const nbVentes = updatedRow.nb_ventes || 0;
                        const stock = nbAchats - nbVentes;

                        // Set the new stock value
                        hot.setDataAtRowProp(row, 'stock', stock); // Update stock in Handsontable

                        // Update the row data for PUT request
                        updatedRow.stock = stock; // Update stock value for PUT request
                    }

                    if (prop === 'nb_ventes' || prop === 'prix_unitaire') {
                        const nbVentes = updatedRow.nb_ventes || 0;
                        const prixUnitaire = updatedRow.prix_unitaire || 0;
                        const ca = nbVentes * prixUnitaire;

                        // Set the new Chiffre d'Affaires value
                        hot.setDataAtRowProp(row, 'ca', ca); // Update Chiffre d'Affaires in Handsontable

                        // Update the row data for PUT request
                        updatedRow.ca = ca; // Update Chiffre d'Affaires value for PUT request
                    }


                    if (oldValue !== newValue) {
                        if (!itemId) {
                            console.error('Error: No ID found for the updated row.');
                            return;
                        }

                        // Send the updated row data to the API
                        $.ajax({
                            url: `${domain}/tp_excel/api/calc_simple/${itemId}/`,
                            method: 'PUT',
                            contentType: 'application/json',
                            headers: {
                                'X-CSRFToken': csrfToken,
                            },
                            data: JSON.stringify(updatedRow), // Convert to JSON
                            success: function (response) {
                                console.log('Row updated successfully:', response);
                            },
                            error: function (xhr, status, error) {
                                console.error('Error updating row:', error);
                                alert('Failed to update the database. Please try again.');
                            }
                        });
                    }
                });
            }
        }
    });

    // Fetch data using jQuery
    $.ajax({
        url: domain + '/tp_excel/api/calc_simple/', //order by id
        method: 'GET',
        success: function (data) {
            hot.loadData(data); // Load data into Handsontable
            // hot.render();
        },
        error: function (xhr, status, error) {
            console.error('Error fetching data:', error);
        }
    });
    function bindDeleteButtonEvents() {
        $(document).off('click', '.delete-btn');
        $(document).on('click', '.delete-btn', function () {
            const row = $(this).closest('tr')[0].rowIndex; // Get the row index
            const id = $(this).data('id'); // Get the ID from the button's data-id attribute
            deleteRow(row, id);
            // console.log('delete')
        });
    }
    function deleteRow(row, id) {
        // Send the DELETE request to the API
        $.ajax({
            url: `${domain}/tp_excel/api/calc_simple/${id}/`,
            method: 'DELETE',
            headers: {
                'X-CSRFToken': csrfToken,
            },
            success: function (response) {
                console.log('Row deleted successfully:', response);

                // Reload the data from the server
                reloadData(); // This function reloads the entire table data
            },
            error: function (xhr, status, error) {
                console.error('Error deleting row:', error);
                alert('Failed to delete the row from the database. Please try again.');
            }
        });
    }

    function reloadData() {
        // Fetch data from the server again
        $.ajax({
            url: domain + '/tp_excel/api/calc_simple/', //order by id
            method: 'GET',
            success: function (data) {
                // Reload the data into Handsontable
                hot.loadData(data);
            },
            error: function (xhr, status, error) {
                console.error('Error fetching data:', error);
            }
        });
    }

    $('#addRowButton').on('click', function () {
        // Create a new empty row
        const newRow = {
            produit: '',
        };

        // Add the new row to Handsontable
        const newRowIndex = hot.countRows();  // Get the index where to insert the new row
        hot.alter('insert_row_below', newRowIndex);

        // Set the data for the new row
        // hot.setDataAtRowProp(newRowIndex, 'produit', newRow.produit);
        // hot.setDataAtRowProp(newRowIndex, 'nb_achats', newRow.nb_achats);
        // hot.setDataAtRowProp(newRowIndex, 'nb_ventes', newRow.nb_ventes);
        // hot.setDataAtRowProp(newRowIndex, 'prix_unitaire', newRow.prix_unitaire);
        // hot.setDataAtRowProp(newRowIndex, 'stock', newRow.stock);
        // hot.setDataAtRowProp(newRowIndex, 'ca', newRow.ca);

        // Send the new row data to the API
        $.ajax({
            url: domain + '/tp_excel/api/calc_simple/',
            method: 'POST',
            contentType: 'application/json',
            headers: {
                'X-CSRFToken': csrfToken, // Include the CSRF token here
            },
            data: JSON.stringify(newRow), // Send the new row data
            success: function (response) {
                console.log('New row added successfully:', response);
                // Optionally, update the row with the returned data (e.g., with an ID)
                const rowId = response.id; // Get the ID from the response
                hot.setDataAtRowProp(newRowIndex, 'id_calc_simple', rowId);
            },
            error: function (xhr, status, error) {
                console.error('Error adding row:', error);
                alert('Failed to add the new row to the database. Please try again.');
            }
        });
    });

    const container2 = document.getElementById('table_ref_absolue');

    const hotTab2 = new Handsontable(container2, {
        data: [], // Empty data initially
        colHeaders: ['Pays', 'CA', 'Part', 'Actions'],
        columns: [
            { data: 'pays', type: 'text', className: 'htCenter' },
            { data: 'ca', type: 'numeric', numericFormat: { pattern: '0,0.00' }, className: 'htCenter' },
            { data: 'part', type: 'numeric', numericFormat: { pattern: '0,0.00' }, className: 'htCenter' },
            {
                data: null,
                renderer: function (instance, td, row, col, prop, value, cellProperties) {
                    const id = instance.getSourceDataAtRow(row).id_ca;
                    td.innerHTML = `<button class="delete-btn" data-id="${id}">X</button>`;
                },
                readOnly: true,
                className: 'htCenter'
            }
        ],
        rowHeaders: false,
        licenseKey: 'non-commercial-and-evaluation',
        stretchH: 'none',
        autoColumnSize: true,
    });

    // Fetch data from API and load into Handsontable
    function loadTab2Data() {
        $.ajax({
            url: `${domain}/tp_excel/api/ca/?order_by=id_ca`,
            method: 'GET',
            success: function (data) {
                hotTab2.loadData(data);
            },
            error: function (xhr, status, error) {
                console.error('Error fetching data for Tab 2:', error);
            }
        });
    }

    loadTab2Data(); // Load data initially when the page loads

    // Delete functionality for Tab 2
    $(document).on('click', '.delete-btn', function () {
        const id = $(this).data('id');
        $.ajax({
            url: `${domain}/tp_excel/api/ca/${id}/`,
            method: 'DELETE',
            success: function (response) {
                console.log('Row deleted successfully for Tab 2:', response);
                loadTab2Data(); // Reload data after deletion
            },
            error: function (xhr, status, error) {
                console.error('Error deleting row for Tab 2:', error);
                alert('Failed to delete the row. Please try again.');
            }
        });
    });

    // Add new row for Tab 2
    $('#addRowButtonTab2').on('click', function () {
        const newRow = { pays: '', ca: null, part: null }; // Default values for the new row
        $.ajax({
            url: `${domain}/tp_excel/api/ca/`,
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(newRow),
            success: function (response) {
                console.log('New row added successfully for Tab 2:', response);
                loadTab2Data(); // Reload data to reflect the newly added row
            },
            error: function (xhr, status, error) {
                console.error('Error adding row for Tab 2:', error);
                alert('Failed to add the new row. Please try again.');
            }
        });
    });
});

