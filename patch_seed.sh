sed -i '/<<<<<<< HEAD/d' js/seed.js
sed -i '/=======/,$d' js/seed.js
cat << 'INNER_EOF' >> js/seed.js
    }
})();
INNER_EOF
