import { useCallback, useState } from "react";
import { ModalDialog } from "./components/playground/ModalDialog";
import { Tabs } from "./components/playground/Tabs";
import { Disclosure } from "./components/playground/Disclosure";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./components/ui/dialog";
import { Tabs as ShadTabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs";

export default function App() {
  const [modalOpen, setModalOpen] = useState(false);
  const closeModal = useCallback(() => setModalOpen(false), []);
  const [saved, setSaved] = useState(false);

  return (
    <main className="app-shell">
      <header className="topbar">
        <div><p className="eyebrow">FOUNDATIONS / ACCESSIBILITY</p><h1>Accessible Components Lab</h1></div>
        <span className="status-pill">React + TypeScript</span>
      </header>
      <section className="intro">
        <div><p className="eyebrow">BUILD · INSPECT · COMPARE</p><h2>Three patterns. Keyboard first.</h2>
          <p>Explore hand-built ARIA patterns, then compare them with Radix-powered shadcn-style components.</p></div>
      </section>
      <div className="content-grid">
        <section className="demo-card">
          <div className="card-kicker">01 / HAND-BUILT</div><h2>Modal dialog</h2>
          <p>Opens with focus moved inside. Tab stays inside, Escape closes, and focus returns to the opener.</p>
          <button className="primary-button" onClick={() => setModalOpen(true)}>Open custom dialog</button>
          <ModalDialog open={modalOpen} onClose={closeModal} title="Review your changes">
            <p>This is a hand-built modal dialog. Try Tab, Shift + Tab, and Escape.</p>
            <label className="field-label" htmlFor="dialog-note">A short note</label>
            <input id="dialog-note" className="text-field" placeholder="Type something…" />
            <div className="button-row"><button className="secondary-button" onClick={closeModal}>Cancel</button><button className="primary-button" onClick={closeModal}>Confirm</button></div>
          </ModalDialog>
        </section>
        <section className="demo-card">
          <div className="card-kicker">02 / HAND-BUILT</div><h2>Tabs</h2>
          <p>Use Left/Right Arrow, Home, and End while focused on a tab. Activation follows focus.</p>
          <Tabs label="Component examples" items={[
            { label: "Overview", content: <p><strong>Overview:</strong> Tabs organize related content into mutually exclusive panels.</p> },
            { label: "Keyboard", content: <p><strong>Keyboard:</strong> Arrow keys move between enabled tabs; Home and End jump to the first and last.</p> },
            { label: "Disabled", disabled: true, content: <p>This panel is disabled.</p> },
            { label: "ARIA", content: <p><strong>ARIA:</strong> tablist, tab, tabpanel, aria-selected, aria-controls, and aria-labelledby.</p> }
          ]} />
        </section>
        <section className="demo-card">
          <div className="card-kicker">03 / HAND-BUILT</div><h2>Disclosure</h2>
          <p>A native button controls a content region. Enter or Space toggles the expanded state.</p>
          <Disclosure title="What makes a disclosure accessible?">
            <p>The trigger exposes its state with <code>aria-expanded</code> and points to the controlled region with <code>aria-controls</code>. Native button behavior supplies Enter and Space activation.</p>
          </Disclosure>
          <Disclosure title="Why use a heading around the trigger?">
            <p>The heading gives the disclosure a useful place in the page's document outline.</p>
          </Disclosure>
        </section>
        <section className="demo-card comparison-card">
          <div className="card-kicker">04 / SHADCN-STYLE + RADIX</div><h2>Compare the primitives</h2>
          <p>These local components follow shadcn's composition style and use Radix for interaction and accessibility behavior.</p>
          <Dialog>
            <DialogTrigger asChild><button className="primary-button">Open Radix dialog</button></DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Radix-powered dialog</DialogTitle><DialogDescription>Focus management, dismissal, and modal semantics are handled by the primitive.</DialogDescription></DialogHeader>
              <p className="radix-copy">Inspect <code>src/components/ui/dialog.tsx</code> to see the thin styling wrapper.</p>
            </DialogContent>
          </Dialog>
          <div className="radix-tabs-wrap">
            <ShadTabs defaultValue="source">
              <TabsList><TabsTrigger value="source">Source</TabsTrigger><TabsTrigger value="behavior">Behavior</TabsTrigger></TabsList>
              <TabsContent value="source">Small wrappers compose Radix primitives and apply project styles.</TabsContent>
              <TabsContent value="behavior">Radix manages roving focus, arrow navigation, and ARIA state for tabs.</TabsContent>
            </ShadTabs>
          </div>
        </section>
      </div>
      <section className="checklist-card">
        <div><div className="card-kicker">KEYBOARD TEST</div><h2>Run the manual checks</h2><p>Use the keyboard only. No mouse required.</p></div>
        <ul>
          <li><kbd>Tab</kbd> / <kbd>Shift + Tab</kbd> — move through controls</li>
          <li><kbd>Escape</kbd> — close the modal</li>
          <li><kbd>←</kbd> <kbd>→</kbd> — move between tabs</li>
          <li><kbd>Home</kbd> / <kbd>End</kbd> — jump to first / last tab</li>
          <li><kbd>Enter</kbd> / <kbd>Space</kbd> — toggle disclosure</li>
        </ul>
        <button className="secondary-button" onClick={() => setSaved((value) => !value)}>{saved ? "Checklist marked complete" : "Mark checklist complete"}</button>
      </section>
      <footer>Accessibility is behavior, not decoration. Verify with keyboard and assistive technology.</footer>
    </main>
  );
}