var app = angular.module('ControleInsulina', ['ngMaterial', 'ngMessages', 'Barbara-Js', 'ui.utils.masks']);

app.config(function ($mdThemingProvider, $mdIconProvider) {
    $mdThemingProvider
        .theme('default')
        .primaryPalette('green')
        .accentPalette('red')
        .warnPalette('amber');

    $mdThemingProvider
        .theme('input')
        .primaryPalette('green')
        .accentPalette('red')
        .warnPalette('amber');

    $mdThemingProvider
        .theme('docs-dark', 'default')
        .primaryPalette('green')
        .accentPalette('red')
        .warnPalette('amber')
        .dark();

    $mdThemingProvider
        .theme('docs-light', 'default')
        .primaryPalette('green')
        .accentPalette('red')
        .warnPalette('amber');

    $mdThemingProvider.enableBrowserColor({});
    $mdIconProvider.defaultIconSet('app/icons/mdi.svg');
});

app.run(function ($rootScope, $mdSidenav, bootstrap) {

    $rootScope.abrirMenu = function () {
        $mdSidenav('menu').toggle();
    };

    $rootScope.loading = bootstrap.loading();
});
