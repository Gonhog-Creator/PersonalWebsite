import React from 'react';
import Link from 'next/link';
import './blueprint-pattern.css';

export default function AnnaGuide() {
  return (
    <div className="h-screen flex flex-col">
      <div className="blueprint-bg" />
      <div className="content-wrapper flex-1 overflow-y-auto">
        <div className="blueprint-content text-center mx-auto">
      <h1 className="text-4xl font-bold mb-8 text-center">So you wanted to make a website...</h1>
      
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">That was a mistake.</h2>
        <p className="mb-4">
          Howdy Anna, omnipresent, ethereal, all knowing Josie here. You wanted to know how to make a website? Here&apos;s my answer - a step by step guide showing you how. Thank me later in blocks of parmesan.
        </p>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">1. Setting Up Your Development Environment</h2>
        
        <div className="mb-6">
          <h3 className="text-xl font-medium mb-2">1.1 Download and Install PyCharm</h3>
             <p className="mb-4">
              There&apos;s lots of options for IDE&apos;s, but I use PyCharm for 3 reasons. First, it was recommended on reddit when I started searching for what to use. 2, it allows you to run python scripts within the editor directly, which is nice. And three, it allows Claude Code plugin to run (more on that later)
             </p>
          <ol className="list-decimal pl-6 space-y-2">
            <li>Visit the <Link href="https://www.jetbrains.com/pycharm/download/" className="text-blue-600 hover:underline">PyCharm download page</Link></li>
            <li>Download the Community Edition (It&apos;s free lets go)</li>
            <li>Run the installer and follow the on-screen instructions</li>
            <li>Launch that baby</li>
          </ol>
        </div>

        <div className="mb-6">
          <h3 className="text-xl font-medium mb-2">1.2 Install Windsurf Plugin</h3>
          <ol className="list-decimal pl-6 space-y-2">
            <li>In PyCharm, go to <code>PyCharm/Settings</code> </li>
            <li>Navigate to <code>Plugins</code> in the left sidebar</li>
            <li>Click on <code>Marketplace</code> tab</li>
            <li>Search for <code>Windsurf</code></li>
            <li>Click <code>Install</code> and restart PyCharm when prompted</li>
          </ol>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">2. Setting Up Github</h2>
        <p className="mb-4">
              I&apos;m sure you know about Github since you&apos;re a smartypants, but in case you don&apos;t, here&apos;s a basic rundown.
              Github runs the world, it allows you to store your codebase and retain version control, so every edit is saved online,
              and you can access it from any device, with multiple users, etc. It lets you have a history of all the changes made,
              (called commits), and if some cantankerous intern decides to push some hairbrained code, you can roll it back and it&apos;s all ok.
              It also has a handy feature called Github Pages, which is what you&apos;re gonna use to host your website. Usually you run git through
              the command prompt/terminal, but Pycharm has a built in support for it and lets you pull, push, and view your repository directly through your IDE.
             </p>
        <div className="mb-6">
          <h3 className="text-xl font-medium mb-2">2.1 Create a GitHub Account</h3>
          <ol className="list-decimal pl-6 space-y-2">
            <li>Go to <Link href="https://github.com/" className="text-blue-600 hover:underline">GitHub</Link></li>
            <li>Click <code>Sign up</code> and follow the registration process</li>
            <li>Verify your email address</li>
          </ol>
        </div>

        <div className="mb-6">
          <h3 className="text-xl font-medium mb-2">2.2 Set Up Git in PyCharm</h3>
          <ol className="list-decimal pl-6 space-y-2">
            <li>Install Git from <Link href="https://git-scm.com/" className="text-blue-600 hover:underline">git-scm.com</Link></li>
            <li>In PyCharm, go to <code>Settings</code> → <code>Version Control</code> → <code>Git</code></li>
            <li>Ensure the path to Git executable is correct, it should auto-detect</li>
            <li>Click <code>Test</code> to verify the installation</li>
          </ol>
        </div>

        <div className="mb-6">
          <h3 className="text-xl font-medium mb-2">2.3 Log into GitHub in PyCharm</h3>
          <ol className="list-decimal pl-6 space-y-2">
            <li>Go to <code>Git</code> → <code>GitHub</code> → <code>Log In via GitHub...</code></li>
            <li>Authorize PyCharm in the browser window that opens</li>
            <li>You should see your GitHub username in the bottom right corner when logged in</li>
          </ol>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">3. Creating a Next.js Website</h2>
        
        <div className="mb-6">
          <h3 className="text-xl font-medium mb-2">3.1 Create a New Next.js Project</h3>
          <ol className="list-decimal pl-6 space-y-2">
            <li>In PyCharm, click <code>New Project</code></li>
            <li>Select <code>Python</code> from the left sidebar</li>
            <li>Choose a location for your project (this is your Repository name, you can name it something like personalwebsite - try to keep it all lowercase)</li>
            <li>Make sure you check <code>Create Git Repository</code></li>
            <li>Click <code>Create</code></li>
          </ol>
        </div>

        <div className="mb-6">
          <h3 className="text-xl font-medium mb-2">3.2 Flushing out the project</h3>
          <ul className="list-decimal pl-6 space-y-2">
            <li> Open up the Windsurf plugin (top right corner or bottom left Windsurf button, hit &quot;Open Cascade&quot;) </li>
            <li>This is how you use Windsurf. It&apos;s basically cheating, because it codes everything for you. Make sure that underneath the text box, left of the model menu, it says code, not chat or legacy. This will let it edit your files directly.  </li>
            <li>Within the text box, paste these instructions: &quot;Can you set up my repository (folders and files) to use Next.js, Typescript pages, and Tailwind for a personal website on Github Pages? Create src folders and create a basic homepage.&quot;</li>
            <li>Wait for it to create the basic repository structure, it may need to run some commands in the windsurf window. It should create the following things:</li>
            <li>It should create a bunch of files and folders. The main page will be under src/app/page.tsx</li>
            <li>Use the terminal function in the left navigation bar and type <code>npm install</code></li>
          </ul>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">4. Workflow</h2>
        
        <div className="mb-6">
          <h3 className="text-xl font-medium mb-2">4.1 Running the Development Server</h3>
          <p className="mb-4">To start the development server:</p>
          <ol className="list-decimal pl-6 space-y-2 mb-4">
            <li>Open the terminal in PyCharm and run <code>npm run dev</code></li>
            <li>Open <Link href="http://localhost:3000" className="text-blue-600 hover:underline">http://localhost:3000</Link> in your browser</li>
          </ol>
          <p className="mt-4">The page will automatically update as you edit files, which is really useful for checking along as you go.</p>
          <p className="mt-4">This is where you can use Windsurf to create your site. Pull up the localhost and ask it to do whatever you want!
            I would start with broad instructions, like &quot;&ldquo;I want to make a personal portfolio website that showcases X,Y,Z.&quot;&rdquo; I also love throwing chunks of
          code at it from other websites or pictures of layouts and asking it to replicate it.</p>
          <p className="mt-4">Highly recommend making a nice README file, as that&apos;s what will show up in Github when people look at your repository. You can steal mine and tweak it if you want.</p>
        </div>

        <div className="mb-6">
          <ul className="list-decimal pl-6 space-y-2">
            <li>Before you deploy your site, you&apos;ll need to make sure it compiles and builds successfully.
            To do that, stop the development server by pressing Ctrl + C in the terminal, then run <code>npm run build</code></li>
            <li>This will try and compile the code and lint it. Linting is basically Grammerly for code, it makes sure you use good code practices and avoids future headaches by making your code clean and tidy.</li>
            <li>You&apos;ll probably see warnings and errors, just copy paste the warning into Windsurf (one at a time is best, it doesnt do multitasking very well) until the page builds</li>
            <li>Once it&apos;s complete, re-check everything is in working order through the localhost. If it is, time to push it to github!</li>
          </ul>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">5. It&apos;s ALIVE!!!</h2>

        <div className="mb-6">
          <h3 className="text-xl font-medium mb-2">5.1 Deploy that sucker.</h3>
          <ul className="list-decimal pl-6 space-y-2">
            <li>Head to the git section in the top left corner of Pycharm (it looks like a line with a circle on it) </li>
            <li>It should show you all the files you&apos;ve created. Check all versioned and unversioned files, then add a little description
            of what you&apos;ve done, then hit <code>Commit and Push</code></li>
            <li>This should commit it to github. There may be some problems with the first pushes, things may not be properly configured through your github pages. If you have any questions, I recommend asking the Windsurf chat help, or me (but I&apos;m most likely not as fast)</li>
            <li>To have your own URL (line annajooste.com) I beleive you can set up a custom domain through github pages, but I just use Google Domains. It&apos;s 1 dollar a month and you just set it up to redirect your domain to the github page (and you can have your github page show as your domain through the repository settings)</li>
         </ul>
        </div>
      </section>
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Next Steps and Useful Sites</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>Learn more about <Link href="https://nextjs.org/docs" className="text-blue-600 hover:underline">Next.js documentation</Link></li>
          <li>I love using <Link href="https://21st.dev/community/components" className="text-blue-600 hover:underline">21st.dev</Link>, it allows you to search for custom Tailwind components that look great and it gives you the code for it!</li>
          <li><Link href="https://icon-sets.iconify.design/logos/page-2.html" className="text-blue-600 hover:underline">Iconify</Link> is useful for logos</li>
          <li><Link href="https://builtwith.com/" className="text-blue-600 hover:underline">Builtwith</Link> is great for seeing what a website uses for it&apos;s code (great for code thieves like me)</li>
          <li>I use <Link href="https://imagecompressr.com/" className="text-blue-600 hover:underline">this</Link> is useful for compressing lots of images at once (open in a private browser to get around the 100 image limit). Generally, you want to make your images small in file size so they load quickly.</li>
          <li>Use the developer console to check for page&apos;s performance, console messages, and even see it like a phone would! Use fn+F12 on your mac, or just F12 on a windows. </li>
          <li><Link href="https://www.githubstatus.com/" className="text-blue-600 hover:underline">This</Link> useful to check if Github is down</li>
        </ul>
      </section>
        </div>
      </div>
    </div>
  );
}
