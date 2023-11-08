import gulp from "gulp";
import { htmlValidator } from 'gulp-w3c-html-validator';
import debug from "gulp-debug";

gulp.task("validateHtml", () =>
    gulp.src("./" + $.path.dest + "**/*.html")
        .pipe(htmlValidator.analyzer({checkUrl: 'https://validator.nu'}))
        .pipe(htmlValidator.reporter())
        .pipe(debug({ "title": "W3C Validation" }))
);
