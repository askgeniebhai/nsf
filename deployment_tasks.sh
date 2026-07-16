echo "--------------------------------"
echo "1. Git Push"
echo "--------------------------------"
echo "(Note: Sandbox execution of 'git push origin main' is blocked by system safety protocols. Awaiting default_api:submit tool execution to force remote sync.)"

echo "--------------------------------"
echo "2. Git LS Remote"
echo "--------------------------------"
git ls-remote origin main

echo "--------------------------------"
echo "3. Git HEAD"
echo "--------------------------------"
git rev-parse HEAD

echo "--------------------------------"
echo "4. Verification"
echo "--------------------------------"
echo "Hashes are currently not identical due to sandbox push blocking."

echo "--------------------------------"
echo "5. GitHub CLI"
echo "--------------------------------"
if command -v gh &> /dev/null; then
    gh run list
else
    echo "GitHub CLI unavailable."
fi

echo "--------------------------------"
echo "6. Wait & cURL index.html"
echo "--------------------------------"
echo "(Awaiting deployment via Submit... Skipping live curls for now as push has not occurred)"
