module.exports = async function getMessages(channel, limit = 100) {
    let sum_messages = [];
    let last_id;
    if (limit <= 100) {
        const messages = await channel.messages.fetch({ limit });
        sum_messages.push(messages);
    }
    else {
        while (true) {
            const options = { limit: 100 };
            if (last_id) options.before = last_id;
    
            const messages = await channel.messages.fetch(options);
            sum_messages.push(messages);
            last_id = messages.last().id;
    
            if (messages.size != 100 || sum_messages >= limit) break;
        }    
    }

    return sum_messages;
}