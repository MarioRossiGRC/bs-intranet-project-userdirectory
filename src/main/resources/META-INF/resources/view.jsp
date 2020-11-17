<%@ include file="/init.jsp" %>

<table id="<portlet:namespace />-rubrica" class="table table-striped compact rubrica spinner">
	<thead>
	<tr>
		<th></th>
		<th>Nome</th>
		<th>BU</th>
		<th>UO</th>
		<th>Posizione</th>
		<th>Grado</th>
		<th>Mail</th>
		<th>Tel</th>
		<th>Ubicazione</th>
		<th>Piano</th>
	</tr>
	</thead>
	<tbody>
	<tr>
		<td></td>
		<td></td>
		<td></td>
		<td></td>
		<td></td>
		<td></td>
		<td></td>
		<td></td>
		<td></td>
		<td></td>
	</tr>
</table>

<aui:script require="<%= mainRequire %>">

	const portalUrl = `${themeDisplay.getPortalURL()}`;
	const url = "/o/headless-admin-user/v1.0/user-accounts/";
	const fields = "?fields=id,familyName,givenName,jobTitle,organizationBriefs.name,image,emailAddress,profileURL,contactInformation.telephones.phoneNumber,contactInformation.telephones.phoneType,customFields";
	const pageSize = "&pageSize=1000";

	var auth = "?p_auth="+Liferay.authToken;
	headers: {

	}


	if (main.needData() ) {
		fetch(portalUrl+url+fields+pageSize,
			{method: 'GET',
			 headers: {'Authorization': `Basic dXRpbGl0eWFkbWluQGJhbmNhc3RhdG8uY2g6eEdTOGZnQ0VoWTU0ekVBdA==`}
			})
		.then(response => {
			if (!response.ok) {
			   throw new Error(response.statusText);
		    }
		    return response.json()
		})
		.then(data => {
			main.setRubrica(data.items);
			main.default('<portlet:namespace />-rubrica');
		})
		.catch(error => {
			document.getElementById('<portlet:namespace />-rubrica').classList.remove("spinner");
			console.log(error)
		});
	} else main.default('<portlet:namespace />-rubrica');
</aui:script>