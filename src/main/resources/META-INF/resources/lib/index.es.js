import $ from 'jquery';
//import * as dt from 'datatables.net';
var dt      = require( 'datatables.net-bs4' )( window, $ );
var dr      = require( 'datatables.net-responsive-bs4' )( window, $ );
var rubrica = [];

export function needData() {
	return (rubrica.length == 0);
}

// Mette il resultset in una forma trattabile per la griglia
export function setRubrica(rawUsers) {
	// Return the custom field values
	function customValue (customFields, fieldName) {
		var el = customFields.find((v) => v.name == fieldName );
		return (el === undefined ? "" : el.customValue.data)
	};

	function organization (orgs) {
		var orgString = "";
		orgs.forEach(function(o,i) {
			orgString += orgString.length == 0 ? o.name : ',' + o.name
		})
		return orgString
	};

	const emptyImage = "/image/user_male_portrait?img_id=35359&img_id_token=ZpKMFiFtKiNZYRIitDE%2BpIUpKqc%3D&t=1598948105604";
	rawUsers.forEach(function(u, index) {
		var tel = u.contactInformation.telephones.find(({phoneType}) => phoneType == "business");
		rubrica.push({
			"Nome": u.givenName + ' ' +  u.familyName,
			"Posizione" : u.jobTitle,
			"BusinessUnit": customValue(u.customFields, "BusinessUnit"),
			"UO" : organization(u.organizationBriefs),
			"Email" : u.emailAddress,
			"Telefono" : (tel === undefined ? "" : tel.phoneNumber ),
			"Grado" : customValue(u.customFields, "Grado"),
			"Ubicazione" : customValue(u.customFields, "Ubicazione"),
			"Piano" : customValue(u.customFields, "Piano"),
			"Profilo" : u.profileURL,
			"Portrait": (u.image === undefined || u.image == "") ? emptyImage : u.image
		});
	})
}

export default function(rootElementId) {

	$(document).ready( function () {
		// Toglie lo spinner
		document.getElementById(`${rootElementId}`).classList.remove("spinner");

		var el = $(`#${rootElementId}`);
		el.DataTable( {
			deferRender: true,
			processing: true,
			order: [[ 1, 'asc' ]],
			pageLength: 5,
			lengthMenu: [ 5, 10, 15, 20, 50 ],
			language: {
				"emptyTable": "Nessun nominativo",
				"info": "Voci da _START_ a _END_ di _TOTAL_ nominativi totali",
				"infoEmpty": "Nessun nominativo",
				"infoFiltered": "(selezionate da _MAX_ nominativi totali)",
				"lengthMenu":   "Mostra _MENU_ voci",
				"loadingRecords": "Recupero nominativi ...",
				"processing": "Elaborazione ...",
				"search": "Cerca Persona:",
				"zeroRecords": "Nessun nominativo corrisponde ai criteri",
				"paginate": {
					"first":      "Prima",
					"last":       "Ultima",
					"next":       "Pag. Successiva",
					"previous":   "Pag. Precedente"
				},
				"aria": {
					"sortAscending":  ": attiva per ordinamento ascendente",
					"sortDescending": ": attiva per ordinamento discendente"
				}
			},
			data: rubrica,
			columns: [
				{
					data: "Portrait",
					render: function (data, type , row) {
						return '<img  src="'+data+'"/>';
					}
				},
				{ data: "Nome" },
				{ data: "BusinessUnit" },
				{ data: "UO" },
				{ data: "Posizione" },
				{ data: "Grado" },
				{ data: "Email",
					render: function (data, type , row) {
						return '<a href="mailto:' + data + '"><svg class="lexicon-icon lexicon-icon-envelope-closed" focusable="false" id="szxy" role="presentation" viewBox="0 0 512 512">\n' +
							'\t<path class="lexicon-icon-outline" d="M448,64H64C28.7,64,0,92.7,0,128v256c0,35.3,28.7,64,64,64h384c35.3,0,64-28.7,64-64V128C512,92.7,483.3,64,448,64z M416,128L275.2,233.6c-11.3,8.5-27.1,8.5-38.4,0L96,128H416z M64,384V184l134.4,100.8c33.1,25.2,77.1,26.2,115.2,0L448,184v200H64z"></path>\n' +
							'</svg></a>';
					}
				},
				{ data: "Telefono",
					render: function (data, type , row) {
						return '<strong> ' + data + '</strong>';
					}
				},
				{ data: "Ubicazione" },
				{ data: "Piano" }
			]
		} );
	} );
}