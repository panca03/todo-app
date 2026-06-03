<?php

namespace App\Providers;

use App\Models\Tag;
use App\Models\TaskComment;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        /*
         * Explicit route-model bindings for params whose name
         * doesn't match the implicit class lookup.
         *  - {comment} -> TaskComment
         *  - {tag}     -> Tag (explicit so it's unambiguous)
         */
        Route::model('comment', TaskComment::class);
        Route::model('tag', Tag::class);
    }
}
