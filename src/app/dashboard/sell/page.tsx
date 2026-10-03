'use client';

import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Image as ImageIcon, Loader2, Plus, Trash2, UploadCloud } from 'lucide-react';
import { PageLayout } from '@/components/layout/PageLayout';
import { createClient } from '@/lib/supabase/client';
import { SUPABASE_URL } from '@/lib/supabase/config';

const initialForm = {
  title: '',
  type: 'vehicle',
  price: '',
  location: '',
  description: '',
};

export default function DashboardSellPage() {
  const router = useRouter();
  const [form, setForm] = useState(initialForm);
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    return () => {
      previews.forEach((preview) => URL.revokeObjectURL(preview));
    };
  }, [previews]);

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const nextFiles = Array.from(event.target.files ?? []);
    if (nextFiles.length === 0) return;

    const nextPreviews = nextFiles.map((file) => URL.createObjectURL(file));
    setFiles(nextFiles);
    setPreviews((current) => {
      current.forEach((preview) => URL.revokeObjectURL(preview));
      return nextPreviews;
    });
  };

  const removeImage = (index: number) => {
    const nextFiles = files.filter((_, fileIndex) => fileIndex !== index);
    const nextPreviews = previews.filter((_, previewIndex) => previewIndex !== index);
    setFiles(nextFiles);
    setPreviews(nextPreviews);
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError('');

    if (!form.title.trim() || !form.location.trim() || !form.price.trim() || !form.description.trim()) {
      setError('Please complete the title, price, location, and description before submitting.');
      return;
    }

    if (Number(form.price) <= 0) {
      setError('Price must be greater than zero.');
      return;
    }

    if (files.length === 0) {
      setError('Please upload at least one listing image.');
      return;
    }

    setSubmitting(true);

    try {
      if (!SUPABASE_URL) {
        throw new Error('Supabase is not configured yet. Add the project URL and keys before uploading images.');
      }

      const supabase = createClient();
      const uploadedUrls: string[] = [];

      for (const file of files) {
        const extension = file.name.includes('.') ? file.name.split('.').pop() || 'jpg' : 'jpg';
        const path = `uploads/${Date.now()}-${Math.random().toString(36).slice(2)}.${extension}`;
        const { data, error: uploadError } = await supabase.storage.from('listings').upload(path, file, {
          cacheControl: '3600',
          upsert: false,
        });

        if (uploadError || !data) {
          throw new Error(uploadError?.message || 'Could not upload an image.');
        }

        uploadedUrls.push(`${SUPABASE_URL}/storage/v1/object/public/listings/${data.path}`);
      }

      const response = await fetch('/api/listings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: form.title.trim(),
          description: form.description.trim(),
          type: form.type,
          price: Number(form.price),
          location: form.location.trim(),
          category: form.type,
          images: uploadedUrls,
          publish: true,
        }),
      });

      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(payload.error || 'Could not create listing.');
      }

      router.push('/dashboard');
      router.refresh();
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : 'Could not create listing.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <PageLayout>
      <section className="section-padding py-12">
        <div className="max-w-3xl mx-auto">
          <Link href="/dashboard" className="inline-flex items-center gap-2 text-sm text-luxury-muted hover:text-gold-400 transition-colors mb-6">
            <ArrowLeft className="w-4 h-4" /> Back to dashboard
          </Link>

          <div className="bg-luxury-card border border-luxury-border rounded-2xl p-6 md:p-8">
            <div className="mb-6">
              <p className="text-sm uppercase tracking-[0.3em] text-gold-400 mb-2">Sell an asset</p>
              <h1 className="text-3xl md:text-4xl font-light">List a new vehicle or property</h1>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="text-sm text-luxury-muted mb-2 block">Title</label>
                <input
                  value={form.title}
                  onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
                  placeholder="2025 Mercedes-Benz G63"
                  className="w-full bg-luxury-dark border border-luxury-border rounded-xl px-4 py-3 text-sm"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-5">
                <div>
                  <label className="text-sm text-luxury-muted mb-2 block">Category</label>
                  <select
                    value={form.type}
                    onChange={(event) => setForm((current) => ({ ...current, type: event.target.value as 'vehicle' | 'property' }))}
                    className="w-full bg-luxury-dark border border-luxury-border rounded-xl px-4 py-3 text-sm"
                  >
                    <option value="vehicle">Vehicle</option>
                    <option value="property">Property</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm text-luxury-muted mb-2 block">Price (NGN)</label>
                  <input
                    type="number"
                    min="1"
                    value={form.price}
                    onChange={(event) => setForm((current) => ({ ...current, price: event.target.value }))}
                    placeholder="25000000"
                    className="w-full bg-luxury-dark border border-luxury-border rounded-xl px-4 py-3 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm text-luxury-muted mb-2 block">Location</label>
                <input
                  value={form.location}
                  onChange={(event) => setForm((current) => ({ ...current, location: event.target.value }))}
                  placeholder="Lekki, Lagos"
                  className="w-full bg-luxury-dark border border-luxury-border rounded-xl px-4 py-3 text-sm"
                />
              </div>

              <div>
                <label className="text-sm text-luxury-muted mb-2 block">Description</label>
                <textarea
                  value={form.description}
                  onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
                  placeholder="Tell buyers what makes this asset special."
                  className="w-full min-h-[120px] bg-luxury-dark border border-luxury-border rounded-xl px-4 py-3 text-sm"
                />
              </div>

              <div>
                <label className="text-sm text-luxury-muted mb-2 block">Images</label>
                <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-luxury-border bg-luxury-dark/50 px-4 py-8 text-center transition-colors hover:border-gold-500/50">
                  <UploadCloud className="w-6 h-6 text-gold-400" />
                  <span className="text-sm text-luxury-muted">Upload multiple images</span>
                  <input type="file" accept="image/*" multiple onChange={handleImageChange} className="hidden" />
                </label>

                {previews.length > 0 && (
                  <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
                    {previews.map((preview, index) => (
                      <div key={`${preview}-${index}`} className="relative overflow-hidden rounded-xl border border-luxury-border bg-luxury-dark">
                        <img src={preview} alt={`Preview ${index + 1}`} className="h-28 w-full object-cover" />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute right-2 top-2 rounded-full bg-black/70 p-1.5 text-white"
                          aria-label={`Remove file ${index + 1}`}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {error ? <p className="rounded-xl border border-rose-500/40 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">{error}</p> : null}

              <div className="flex items-center justify-between pt-2">
                <Link href="/dashboard" className="text-sm text-luxury-muted hover:text-gold-400 transition-colors">
                  Cancel
                </Link>
                <button type="submit" disabled={submitting} className="btn-primary inline-flex items-center gap-2 disabled:opacity-70">
                  {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                  {submitting ? 'Publishing...' : 'Publish listing'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
