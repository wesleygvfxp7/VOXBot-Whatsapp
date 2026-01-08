const { createCanvas, loadImage } = require('canvas');
const fs = require('fs');

module.exports = {
    name: "love",
    description: "Mostra o amor entre duas pessoas!",
    usage: "!love @usuario1 @usuario2",
    async run(client, message, args) {
        // Confere se tem exatamente 2 menções
        if (!message.mentions.users || message.mentions.users.size !== 2) {
            return message.reply("Marque **exatamente duas pessoas** para medir o amor!");
        }

        const users = Array.from(message.mentions.users.values());
        const user1 = users[0];
        const user2 = users[1];

        // Pega URL das imagens de perfil (só funciona se tiver link público)
        const imgUrl1 = user1.displayAvatarURL({ format: 'png', size: 256 });
        const imgUrl2 = user2.displayAvatarURL({ format: 'png', size: 256 });

        // Gera porcentagem de amor aleatória
        const lovePercent = Math.floor(Math.random() * 101);

        // Cria canvas
        const width = 600;
        const height = 300;
        const canvas = createCanvas(width, height);
        const ctx = canvas.getContext('2d');

        // Fundo
        ctx.fillStyle = '#1a1a1a';
        ctx.fillRect(0, 0, width, height);

        // Carrega imagens
        const img1 = await loadImage(imgUrl1);
        const img2 = await loadImage(imgUrl2);
        const imgSize = 200;
        const padding = 50;

        ctx.drawImage(img1, padding, (height - imgSize) / 2, imgSize, imgSize);
        ctx.drawImage(img2, width - imgSize - padding, (height - imgSize) / 2, imgSize, imgSize);

        // Nomes
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 30px Sans';
        ctx.textAlign = 'center';
        ctx.fillText(user1.username, padding + imgSize / 2, height - 30);
        ctx.fillText(user2.username, width - padding - imgSize / 2, height - 30);

        // Barra de amor
        const barWidth = 400;
        const barHeight = 30;
        const barX = (width - barWidth) / 2;
        const barY = 50;

        ctx.fillStyle = '#555';
        ctx.fillRect(barX, barY, barWidth, barHeight);

        ctx.fillStyle = '#ff4d6d';
        ctx.fillRect(barX, barY, (lovePercent / 100) * barWidth, barHeight);

        // Texto da porcentagem
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 28px Sans';
        ctx.fillText(`${lovePercent}%`, width / 2, barY + 25);

        // Salva buffer e envia
        const buffer = canvas.toBuffer();
        fs.writeFileSync('love.png', buffer);

        await message.channel.send({
            content: `💖 O amor entre ${user1} e ${user2} é de **${lovePercent}%**!`,
            files: ['love.png']
        });
    }
};
