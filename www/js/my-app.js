
// Import F7
// Initialize app
var myApp = new Framework7({
    // App root element
    root: '#app',
    // App Name
    name: 'Budget',
    // App id
    id: 'com.myapp.test',
    
    // Enable swipe panel
    panel: {
        swipe: 'left',
    },
    // Add default routes
    routes: [
        {
            path: '/about/',
            url: 'about.html',
        },
        {
            path: '/Expenses/',
            url: 'Expenses.html',
        },
        {
            path: '/index/',
            url: 'index.html'
        },
        {
            path: '/Expee/',
            pageName: 'Expee'
        }
    ],

    // ... other parameters
});

// If we need to use custom DOM library, let's save it to $$ variable:
var $$ = Dom7;

// Add view
var mainView = myApp.views.create('.view-main', {
    // Because we want to use dynamic navbar, we need to enable it for this view:
    stackPages: true,
});


// Handle Cordova Device Ready Event
$$(document).on('deviceready', function() {
    console.log("Device is ready!");
});

/* $$(document).on('page:init', function (e) {
    // Do something here when page loaded and initialized
    alert("yo")
}); */



