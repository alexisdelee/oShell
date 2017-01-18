# oShell

## Fonctionnement

Avoir accès au shell du pc A sur le pc B :  
- exécuter  __``oShell.exe``__ sur le pc A 
- sélectionner l'adresse voulue (supposons 192.168.1.54) 
- ouvrir un navigateur connecté au même réseau sur le pc B et aller à l'adresse suivante 192.168.1.54:8080 

Une fois sur cette page, vous avez accès au shell du pc A. Les sorties standards et d'erreurs seront redirigées dans la console du navigateur.

## Remarques

Hash sha256 du fichier  __``oShell.exe``__ : 0354e5d9f076390d91b59f75aa8d585a8dc2fc2bf8aa2da4faf9730ede0d77cc

Il est possible d'exécuter **oShell** avec node.js : ``node oShell.js``

Pour compiler l'application sur d'autres systèmes, utilisez encloseJS : ``enclose -o ./oShell ./oShell.js``
