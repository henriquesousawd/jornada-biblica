# Contrato opcional para TTS futuro

O aplicativo não chama Google Cloud Text-to-Speech, Azure Speech ou endpoints privados. Uma integração futura deve ficar no backend e expor somente um contrato próprio, por exemplo:

- `GET /api/tts/voices` — lista vozes autorizadas sem expor chaves.
- `POST /api/tts/synthesize` — recebe texto e parâmetros validados e retorna áudio autorizado.
- O backend deve guardar credenciais em variáveis de ambiente/secret manager.
- O frontend deve receber apenas URL temporária ou stream autorizado.
- Cache/offline só pode ser ativado quando a licença do provedor permitir.

O funcionamento gratuito atual usa exclusivamente as vozes fornecidas pelo navegador.
