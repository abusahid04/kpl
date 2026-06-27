<?php
// Redirect root Apache requests to the compiled React SPA in the dist directory
header("Location: /kpl/dist/");
exit;
