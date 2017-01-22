# oShell

## Fonctionnement

Avoir accès au shell du pc A sur le pc B :  
- exécuter  __``oShell.exe``__ sur le pc A 
- sélectionner l'adresse et le port voulus (supposons 192.168.1.54 et 8080) 
- ouvrir un navigateur connecté au même réseau sur le pc B et aller à l'adresse suivante 192.168.1.54:8080 

Une fois sur cette page, vous avez accès au shell du pc A. Les sorties standards et d'erreurs seront redirigées dans la console du navigateur.

## Remarques

Hash sha256 du fichier  __``oShell.exe``__ : 9fcf9a3493b8f878d7a3d3f74974f2ad9ecfddc8d9f43a791b0a8b02e2aec265

Il est possible d'exécuter **oShell** avec node.js : ``node oShell.js``

Pour compiler l'application sur d'autres systèmes, utilisez encloseJS : ``enclose -o ./oShell ./oShell.js``
