// frappe.pages['cp'].on_page_load = function(wrapper) {
// 	console.log(wrapper)
// 	var page = frappe.ui.make_app_page({
// 		parent: wrapper,
// 		title: 'Channel Partner',
// 		single_column: true
// 	});
// }


// frappe.pages['cp'].on_page_load = function (wrapper) {
//     var page = frappe.ui.make_app_page({
//         parent: wrapper,
//         title: 'Channel Partner',
//         single_column: true
//     });

//     // Add a button with an href using add_menu_item
//     page.add_menu_item('Go to Google', () => {
//         window.location.href = '/app/my-stock';
//     });

//     // OR add a button with an href to the DOM
//     $(page.body).append(`
//         <a href="/app/my-stock" target="_blank" class="btn btn-lg btn-success" id="custom-link-button">
//             Stock
//         </a>
//     `);
// };




frappe.pages['cp'].on_page_load = function (wrapper) {
    // Create the page
    var page = frappe.ui.make_app_page({
        parent: wrapper,
        title: 'Channel Partner',
        single_column: true
    });

    // Add collapsible button and links
    $(page.body).append(`
		<div class="row">
			<div class="col-md-2">
			        <div>
            <!-- Collapsible Button -->
            <button class="btn btn-primary mb-3" type="button" data-toggle="collapse" data-target="#collapsible-links" aria-expanded="false" aria-controls="collapsible-links">
                CP Module
            </button>

            <!-- Collapsible Content -->
            <div class="collapse" id="collapsible-links">
                <div class="d-grid gap-2">
                    <a href="/app/channel-partner/" class="btn btn-info btn-block" target="_blank">CP Master</a>
                    <a href="/app/sales-executive/" class="btn btn-info btn-block" target="_blank">SE Master</a>
                </div>
            </div>
        </div>
		</div>
    `);

    // Ensure Bootstrap JS components work
    if (typeof bootstrap === 'undefined') {
        console.error('Bootstrap JS is missing. Ensure it is loaded.');
    }
};
