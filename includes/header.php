<?php

declare(strict_types=1);

?>
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title><?= e(APP_NAME) ?></title>
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = { theme: { extend: { colors: { ink: "#111827", graphite: "#1f2937", steel: "#475569", limefit: "#a3e635", aqua: "#14b8a6", flame: "#f97316", mist: "#f8fafc", line: "#e2e8f0" }, boxShadow: { panel: "0 18px 46px rgba(15, 23, 42, .10)" } } } };
  </script>
  <link rel="stylesheet" href="assets/css/styles.css">
</head>
<body class="bg-mist text-slate-900">
<?php render_flash(); ?>

