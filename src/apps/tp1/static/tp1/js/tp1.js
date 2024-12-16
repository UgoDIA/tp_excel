
$(document).ready(function () {
    const domain = window.location.origin;
    const container = document.getElementById('table_calc_simple');


    const hot = new Handsontable(container, {
        data: [], 
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
            bindDeleteButtonEvents(); 
        },
        afterChange: function (changes, source) {
            if (source === 'edit') { 
                changes.forEach(([row, prop, oldValue, newValue]) => {
                    const updatedRow = hot.getSourceDataAtRow(row); 
                    const itemId = updatedRow.id_calc_simple; 

                 
                    if (prop === 'nb_achats' || prop === 'nb_ventes') {
                    
                        const nbAchats = updatedRow.nb_achats || 0;
                        const nbVentes = updatedRow.nb_ventes || 0;
                        const stock = nbAchats - nbVentes;

                        hot.setDataAtRowProp(row, 'stock', stock); 

                       
                        updatedRow.stock = stock; 
                    }

                    if (prop === 'nb_ventes' || prop === 'prix_unitaire') {
                        const nbVentes = updatedRow.nb_ventes || 0;
                        const prixUnitaire = updatedRow.prix_unitaire || 0;
                        const ca = nbVentes * prixUnitaire;

                        hot.setDataAtRowProp(row, 'ca', ca); 

                      
                        updatedRow.ca = ca; 
                    }


                    if (oldValue !== newValue) {
                        if (!itemId) {
                            console.error('Error: No ID found for the updated row.');
                            return;
                        }

                    
                        $.ajax({
                            url: `${domain}/tp_excel/api/calc_simple/${itemId}/`,
                            method: 'PUT',
                            contentType: 'application/json',
                            headers: {
                                'X-CSRFToken': csrfToken,
                            },
                            data: JSON.stringify(updatedRow), 
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


    $.ajax({
        url: domain + '/tp_excel/api/calc_simple/', 
        method: 'GET',
        success: function (data) {
            hot.loadData(data); 
            
        },
        error: function (xhr, status, error) {
            console.error('Error fetching data:', error);
        }
    });
    function bindDeleteButtonEvents() {
        $(document).off('click', '.delete-btn');
        $(document).on('click', '.delete-btn', function () {
            const row = $(this).closest('tr')[0].rowIndex; 
            const id = $(this).data('id'); 
            deleteRow(row, id);
      
        });
    }
    function deleteRow(row, id) {
  
        $.ajax({
            url: `${domain}/tp_excel/api/calc_simple/${id}/`,
            method: 'DELETE',
            headers: {
                'X-CSRFToken': csrfToken,
            },
            success: function (response) {
                console.log('Row deleted successfully:', response);

               
                reloadData(); 
            },
            error: function (xhr, status, error) {
                console.error('Error deleting row:', error);
                alert('Failed to delete the row from the database. Please try again.');
            }
        });
    }

    function reloadData() {
       
        $.ajax({
            url: domain + '/tp_excel/api/calc_simple/', 
            method: 'GET',
            success: function (data) {
               
                hot.loadData(data);
            },
            error: function (xhr, status, error) {
                console.error('Error fetching data:', error);
            }
        });
    }

    $('#addRowButton').on('click', function () {
      
        const newRow = {
            produit: '',
        };

  
        const newRowIndex = hot.countRows(); 
        hot.alter('insert_row_below', newRowIndex);

        $.ajax({
            url: domain + '/tp_excel/api/calc_simple/',
            method: 'POST',
            contentType: 'application/json',
            headers: {
                'X-CSRFToken': csrfToken, 
            },
            data: JSON.stringify(newRow), 
            success: function (response) {
                console.log('New row added successfully:', response);
               
                const rowId = response.id_calc_simple; 
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
        data: [], 
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

    loadTab2Data(); 

  
    $(document).on('click', '.delete-btn', function () {
        const id = $(this).data('id');
        $.ajax({
            url: `${domain}/tp_excel/api/ca/${id}/`,
            method: 'DELETE',
            success: function (response) {
                console.log('Row deleted successfully for Tab 2:', response);
                loadTab2Data(); 
            },
            error: function (xhr, status, error) {
                console.error('Error deleting row for Tab 2:', error);
                alert('Failed to delete the row. Please try again.');
            }
        });
    });

    $('#addRowButtonTab2').on('click', function () {
        const newRow = { pays: '', ca: null, part: null }; 
        $.ajax({
            url: `${domain}/tp_excel/api/ca/`,
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(newRow),
            success: function (response) {
                console.log('New row added successfully for Tab 2:', response);
                loadTab2Data(); 
            },
            error: function (xhr, status, error) {
                console.error('Error adding row for Tab 2:', error);
                alert('Failed to add the new row. Please try again.');
            }
        });
    });
});

