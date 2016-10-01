var elixir = require('laravel-elixir');
require('laravel-elixir-vueify');

elixir(function(mix) {
    mix.browserify('./resources/js/app.js', 'public/js/app.js');
});
