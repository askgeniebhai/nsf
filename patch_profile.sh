sed -i '/<<<<<<< HEAD/d' guard/profile.html
sed -i '/=======/d' guard/profile.html
sed -i '/>>>>>>> origin\/main/d' guard/profile.html
sed -i '/<script src="..\/js\/seed.js"><\/script>/d' guard/profile.html
sed -i '/<script src="..\/js\/auth.js"><\/script>/d' guard/profile.html
sed -i "/AuthService.checkAuth('guard');/d" guard/profile.html
cat << 'INNER_EOF' >> guard/profile.html
    <script src="../js/StorageService.js"></script>
    <script src="../js/seed.js"></script>
    <script src="../js/auth.js"></script>
    <script src="../js/ui-components.js"></script>
    <script src="../js/identity.js"></script>
    <script>
        const user = AuthService.checkAuth('guard');
        UI.renderSidebar('profile');
        UI.renderTopNav('Identity Profile');
        IdentityModule.initGuard(user.id);
    </script>
</body>
</html>
INNER_EOF
