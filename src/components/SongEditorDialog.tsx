import * as React from "react";
import { useDeferredValue, useMemo, useState } from "react";
import { Music2, Save } from "lucide-react";

import { Button } from "@/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/ui/dialog";
import { Input } from "@/ui/input";
import { Label } from "@/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/ui/select";
import { Textarea } from "@/ui/textarea";
import { cn } from "@/lib/utils";
import {
  parseSongLyrics,
  songCategories,
  type Song,
  type SongCategory,
  type SongEditorInput,
  validateSongInput,
} from "@/lib/song-library";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** When set, the dialog opens in edit mode for this song; otherwise create. */
  song?: Song | null;
  onSave: (input: SongEditorInput, id?: string) => void;
};

const DEFAULT_LYRICS = `Verse 1:
First line of verse one,
Second line of verse one.

Chorus:
Chorus line one,
Chorus line two.

Verse 2:
First line of verse two.
`;

const EMPTY_INPUT: SongEditorInput = {
  title: "",
  author: "",
  key: "G",
  category: "worship",
  copyright: "",
  ccli: "",
  tags: [],
  lyrics: DEFAULT_LYRICS,
};

export function SongEditorDialog({ open, onOpenChange, song, onSave }: Props) {
  const isEdit = Boolean(song);

  const [input, setInput] = useState<SongEditorInput>(() =>
    song ? songToInput(song) : EMPTY_INPUT,
  );
  const [submitted, setSubmitted] = useState(false);

  // Reset the form whenever the dialog opens or the target song changes so
  // toggling between create / edit doesn't leak state.
  React.useEffect(() => {
    if (open) {
      setInput(song ? songToInput(song) : EMPTY_INPUT);
      setSubmitted(false);
    }
  }, [open, song]);

  const deferredLyrics = useDeferredValue(input.lyrics);
  const parsedSections = useMemo(() => parseSongLyrics(deferredLyrics), [deferredLyrics]);

  const error = useMemo(() => validateSongInput(input), [input]);
  const showErrors = submitted && error !== null;

  const set = <K extends keyof SongEditorInput>(key: K, value: SongEditorInput[K]) => {
    setInput((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = () => {
    setSubmitted(true);
    if (error) return;
    onSave(input, song?.id);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl gap-0 p-0">
        <DialogHeader className="border-b border-hairline px-5 py-4 text-left">
          <DialogTitle className="flex items-center gap-2 text-base font-medium">
            <Music2 className="size-4 text-beam" />
            {isEdit ? "Edit song" : "New song"}
          </DialogTitle>
          <DialogDescription className="text-[12px]">
            {isEdit
              ? "Update the song's metadata and lyrics. Changes apply to all services using this song."
              : "Add a song to your library. It will appear in the Song bank and be available to add to any service."}
          </DialogDescription>
        </DialogHeader>

        <div className="flex min-h-0 h-[62vh]">
          {/* Left column: form fields + lyrics textarea */}
          <div className="flex w-1/2 min-w-0 flex-col overflow-y-auto scroll-slim">
            <div className="grid grid-cols-2 gap-3 border-b border-hairline p-4">
              <div className="col-span-2 space-y-1.5">
                <Label htmlFor="song-title" className="eyebrow">
                  Title
                </Label>
                <Input
                  id="song-title"
                  value={input.title}
                  onChange={(e) => set("title", e.target.value)}
                  placeholder="e.g. Amazing Grace"
                  className={cn(
                    "h-8 bg-panel-raised/60 text-[13px] ring-hairline",
                    showErrors && !input.title.trim() && "ring-destructive",
                  )}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="song-author" className="eyebrow">
                  Author
                </Label>
                <Input
                  id="song-author"
                  value={input.author}
                  onChange={(e) => set("author", e.target.value)}
                  placeholder="e.g. John Newton"
                  className="h-8 bg-panel-raised/60 text-[13px] ring-hairline"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="song-key" className="eyebrow">
                  Key
                </Label>
                <Input
                  id="song-key"
                  value={input.key}
                  onChange={(e) => set("key", e.target.value)}
                  placeholder="G, Bb, F#m…"
                  className="h-8 bg-panel-raised/60 text-[13px] ring-hairline"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="song-category" className="eyebrow">
                  Category
                </Label>
                <Select
                  value={input.category}
                  onValueChange={(v) => set("category", v as SongCategory)}
                >
                  <SelectTrigger
                    id="song-category"
                    className="h-8 bg-panel-raised/60 text-[13px] ring-hairline"
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {songCategories.map((cat) => (
                      <SelectItem key={cat.value} value={cat.value}>
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="song-bpm" className="eyebrow">
                  BPM (optional)
                </Label>
                <Input
                  id="song-bpm"
                  type="number"
                  min={30}
                  max={300}
                  value={input.bpm ?? ""}
                  onChange={(e) => set("bpm", e.target.value ? Number(e.target.value) : undefined)}
                  placeholder="—"
                  className="h-8 bg-panel-raised/60 text-[13px] ring-hairline"
                />
              </div>
              <div className="col-span-2 space-y-1.5">
                <Label htmlFor="song-tags" className="eyebrow">
                  Tags (comma-separated)
                </Label>
                <Input
                  id="song-tags"
                  value={input.tags.join(", ")}
                  onChange={(e) =>
                    set(
                      "tags",
                      e.target.value
                        .split(",")
                        .map((t) => t.trim())
                        .filter(Boolean),
                    )
                  }
                  placeholder="grace, classic, worship"
                  className="h-8 bg-panel-raised/60 text-[13px] ring-hairline"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="song-copyright" className="eyebrow">
                  Copyright (optional)
                </Label>
                <Input
                  id="song-copyright"
                  value={input.copyright ?? ""}
                  onChange={(e) => set("copyright", e.target.value)}
                  placeholder="Public Domain · 1779"
                  className="h-8 bg-panel-raised/60 text-[13px] ring-hairline"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="song-ccli" className="eyebrow">
                  CCLI # (optional)
                </Label>
                <Input
                  id="song-ccli"
                  value={input.ccli ?? ""}
                  onChange={(e) => set("ccli", e.target.value)}
                  placeholder="22025"
                  className="h-8 bg-panel-raised/60 text-[13px] ring-hairline"
                />
              </div>
            </div>

            <div className="flex min-h-0 flex-1 flex-col p-4">
              <div className="mb-2 flex items-center justify-between">
                <Label htmlFor="song-lyrics" className="eyebrow">
                  Lyrics
                </Label>
                <span className="text-[10.5px] text-muted-foreground">
                  {parsedSections.length} section{parsedSections.length === 1 ? "" : "s"} parsed
                </span>
              </div>
              <Textarea
                id="song-lyrics"
                value={input.lyrics}
                onChange={(e) => set("lyrics", e.target.value)}
                spellCheck={false}
                placeholder={DEFAULT_LYRICS}
                className="min-h-0 flex-1 resize-none bg-panel-raised/60 font-mono text-[12px] leading-relaxed ring-hairline"
              />
              <p className="mt-2 text-[10.5px] leading-snug text-muted-foreground">
                Use a header line ending in <code className="text-foreground/80">:</code> to start a
                section (e.g. <code className="text-foreground/80">Verse 1:</code>,{" "}
                <code className="text-foreground/80">Chorus:</code>,
                <code className="text-foreground/80"> Bridge:</code>). Lines starting with{" "}
                <code className="text-foreground/80">//</code> are comments.
              </p>
            </div>
          </div>

          {/* Right column: live slide preview */}
          <div className="flex w-1/2 min-w-0 flex-col border-l border-hairline bg-panel/40">
            <div className="border-b border-hairline px-4 py-3">
              <p className="eyebrow">Slide preview</p>
              <p className="mt-0.5 truncate text-[12px] text-muted-foreground">
                {input.title.trim() || "Untitled song"} · {input.author.trim() || "—"}
              </p>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto p-4 scroll-slim">
              {parsedSections.length === 0 ? (
                <div className="grid h-full place-items-center text-[12px] text-muted-foreground">
                  Start typing lyrics to see the slide preview.
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {parsedSections.map((section, index) => (
                    <div
                      key={`${section.id}-${index}`}
                      className="overflow-hidden rounded-lg ring-1 ring-hairline"
                    >
                      <div className="aspect-video w-full bg-paper px-3 py-2 text-paper-ink">
                        <p className="text-[8.5px] font-medium tracking-[0.2em] uppercase text-paper-ink/45">
                          {`${input.title.trim() || "Untitled"} · ${section.label}`}
                        </p>
                        <div className="mt-1.5 space-y-0.5">
                          {section.lines.map((line, i) => (
                            <p
                              key={i}
                              className="font-serif text-[11px] leading-tight text-balance"
                            >
                              {line}
                            </p>
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center justify-between bg-panel-raised/70 px-2 py-1">
                        <span className="truncate text-[10.5px]">{section.label}</span>
                        <span className="text-[9.5px] text-muted-foreground">{index + 1}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {showErrors && error && (
          <div className="border-t border-destructive/30 bg-destructive/10 px-5 py-2.5 text-[12px] text-destructive">
            {error}
          </div>
        )}

        <DialogFooter className="border-t border-hairline px-5 py-3">
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>
            <Save className="size-3.5" />
            {isEdit ? "Save changes" : "Create song"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/** Convert an existing Song into the editor's plain-text input shape. */
function songToInput(song: Song): SongEditorInput {
  const input: SongEditorInput = {
    title: song.title,
    author: song.author,
    key: song.key,
    category: song.category,
    copyright: song.copyright ?? "",
    ccli: song.ccli ?? "",
    tags: song.tags,
    lyrics: song.sections
      .map((section) => `${section.label}:\n${section.lines.join("\n")}`)
      .join("\n\n"),
  };
  // Only include `bpm` when the song actually has one — keeping the property
  // absent (rather than `undefined`) so the BPM input shows a placeholder.
  if (song.bpm !== undefined) input.bpm = song.bpm;
  return input;
}
