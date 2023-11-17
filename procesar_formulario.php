<?php
$name = $_POST['nombre'];
$phone = $_POST['phone'];
$mail = $_POST['email'];
$asunto = $_POST['asunto'];
$mensaje = $_POST['mensaje'];

$header = 'From: ' . $mail . " \r\n ";
$header .= "X-Mailer: PHP/" . phpversion() . " \r\n ";
$header .= "Mime-Version: 1.0  \r\n ";
$header .= "Content-Type: text/plain;charset=utf-8\r\n";

$message = "Este mensaje fue enviado por: " . $name . " \r\n";
$message .= "Teléfono de contacto: " . $phone . " \r\n";
$message .= "Correo electrónico: " . $mail . " \r\n";
$message .= "Asunto: " . $asunto . " \r\n";
$message .= "Mensaje: " . $mensaje . " \r\n";

$para = 'josuedanielpachecodeleon554@gmail.com';
$asunto = 'Asunto del mensaje';

mail($para, $asunto, utf8_decode($message), $header);
header("Location: https://desarrollojosuecv.netlify.app");
?>
