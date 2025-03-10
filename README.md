# LateralGPT

## Decisions & Process

I started building the UI and component using v0.dev. It's a short time frame
and I wanted to spend my time working on this really pushing myself with how to
use [tools](https://sdk.vercel.ai/docs/ai-sdk-core/tools-and-tool-calling) correctly.
In my personal apps, I configured the prompt to return MDX that I could render
React components, but there are a lot of properties here and I don't trust
OpenAI to send all the props right.

_v0 aside_, this is my first time using it's full export with shadcn stuff and
boy does it have a bunch of code smells that I do not like. Adding the full
shadcn library, disabling typescript checking and a bunch of other things that
do not happen when you use `pnpm shadcn` to install components piecemeal. Alas,
this is what we have.

I decided not to setup chat memory, so all chats are ephemeral. If I were to
setup memory, I would "agent"-ify this with [mastra](https://mastra.ai/), which
has memory built right in.

I thought a nice feature would be allowing deep-linking to specific profiles.
The use case being that you are an executive recruiter and you want one of your
underlings to actually reach out, so you give them a list of profiles that they
can pull up when emailing.

_As an aside_, I really want to improve your search API such that all fields can
be repeated! Having to do multiple tool calls for some queries (name, company,
etc) but not for colleges is annoying.

Overall, this took me 5 hours across two days. It's somewhat ugly, but it's
a decent first draft.

## Running

Create a `.env` with an `OPENAI_API_KEY` set.

```bash
# Install deps and run the dev server
pnpm i
pnpm dev
```
