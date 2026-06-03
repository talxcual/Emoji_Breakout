const fs = require('fs');
const paths = ['game.js', 'app/src/main/assets/game.js'];
const oldStr = `                const tr = document.createElement('tr');
                tr.innerHTML = \`
                    <td>${medal}</td>
                    <td>${data.name || 'Jugador'}</td>
                    <td>${data.profilePic ? \\\`<img src="${data.profilePic}" style="width: 30px; height: 30px; border-radius: 50%;">\\\` : "-"}</td>
                    <td>${data.score || 0}</td>
                \`;`;
const newStr = `                let avatarSrc = data.profilePic || "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='80' height='80' viewBox='0 0 80 80'><circle cx='40' cy='40' r='40' fill='%238b5cf6'/><text x='40' y='50' font-size='32' text-anchor='middle' fill='white'>?</text></svg>";
                const tr = document.createElement('tr');
                tr.innerHTML = \`
                    <td>${medal}</td>
                    <td style="text-align: left; padding-left: 10px;">
                        <img class="leaderboard-avatar" src="${avatarSrc}" alt="Avatar">
                        ${data.name || 'Jugador'}
                    </td>
                    <td>${data.maxLevel || 1}</td>
                    <td style="color: #eab308; font-weight: bold;">${data.score || 0}</td>
                \`;`;

paths.forEach(p => {
    let content = fs.readFileSync(p, 'utf8');
    content = content.replace(oldStr, newStr);
    fs.writeFileSync(p, content, 'utf8');
});
console.log('Done');
