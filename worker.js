// Worker: serve o site (assets) e expõe /api/notify para avisar no Telegram.
// Os segredos TELEGRAM_TOKEN e TELEGRAM_CHAT_ID ficam no Cloudflare (Settings > Variables and Secrets).

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (request.method === 'POST' && url.pathname === '/api/notify') {
      // se ainda não configurou os segredos, não quebra nada
      if (!env.TELEGRAM_TOKEN || !env.TELEGRAM_CHAT_ID) {
        return new Response('telegram nao configurado', { status: 200 });
      }
      let data = {};
      try { data = await request.json(); } catch (_) {}

      const esc = (s) => String(s ?? '').replace(/[<>&]/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;' }[c]));
      const linhas = [];
      const add = (label, val) => { if (val !== undefined && val !== null && String(val).trim() !== '') linhas.push(`<b>${label}:</b> ${esc(val)}`); };

      const titulo = data._tipo === 'inscricao'
        ? '✅ <b>Nova INSCRIÇÃO</b> (cadastro + pagamento)'
        : '📝 <b>Nova avaliação de perfil</b>';

      add('Nome', data.nome);
      add('WhatsApp', data.whatsapp);
      add('E-mail', data.email);
      add('Empresa', data.empresa);
      add('Segmento', data.segmento);
      add('Perfil', data.perfil);
      add('Objetivo', data.objetivo);
      add('Disponível p/ investir', data.investimento);
      add('Disponibilidade nas datas', data.disponibilidade);
      if (data.qualificado === true) add('Qualificado', 'Sim');
      if (data.qualificado === false) add('Qualificado', 'Não');
      add('Forma de pagamento', data.forma_pagamento);
      add('CPF', data.cpf);
      add('Endereço', data.endereco);
      add('CNPJ', data.cnpj);
      add('Observações', data.observacoes);

      const text = titulo + '\n\n' + linhas.join('\n');

      // TELEGRAM_CHAT_ID pode ter vários destinatários separados por vírgula
      const chatIds = String(env.TELEGRAM_CHAT_ID).split(',').map((s) => s.trim()).filter(Boolean);
      await Promise.all(chatIds.map((chat_id) =>
        fetch(`https://api.telegram.org/bot${env.TELEGRAM_TOKEN}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ chat_id, text, parse_mode: 'HTML', disable_web_page_preview: true }),
        }).catch(() => {})
      ));

      return new Response('ok', { status: 200 });
    }

    // qualquer outra rota: serve os arquivos do site
    return env.ASSETS.fetch(request);
  },
};
