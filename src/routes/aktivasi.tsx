import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { PageHeader } from "~/components/sections/PageHeader";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { Badge, StatusDot } from "~/components/ui/badge";
import { Skeleton } from "~/components/ui/skeleton";
import { useToast } from "~/components/ui/toast";
import { Mail, Loader, AlertTriangle, Check } from "~/components/ui/icons";
import { emailSchema } from "~/lib/api/schemas";
import { requestVerification, getPublicConfig } from "~/lib/api/client";
import { z } from "zod";

export const Route = createFileRoute("/aktivasi")({
  component: AktivasiPage,
});

const formSchema = z.object({ email: emailSchema });
type FormValues = z.infer<typeof formSchema>;

function AktivasiPage() {
  const { push } = useToast();
  const [result, setResult] = useState<{ status: string; message: string } | null>(null);

  const config = useQuery({
    queryKey: ["public-config"],
    queryFn: getPublicConfig,
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(formSchema) });

  const mutation = useMutation({
    mutationFn: (values: FormValues) => requestVerification(values.email),
    onSuccess: (data) => {
      setResult({ status: data.status, message: data.message });
      if (data.status === "not_configured") {
        push({ tone: "info", title: "Integrasi belum dikonfigurasi", description: data.message });
      } else if (data.ok) {
        push({ tone: "success", title: "Permintaan terkirim", description: data.message });
      } else {
        push({ tone: "error", title: "Verifikasi gagal", description: data.message });
      }
    },
    onError: () => {
      push({
        tone: "error",
        title: "Gagal menghubungi server",
        description: "Periksa koneksi internet Anda dan coba lagi.",
      });
    },
  });

  const onSubmit = (values: FormValues) => {
    setResult(null);
    mutation.mutate(values);
  };

  const integrationConfigured = config.data?.integrationConfigured ?? false;

  return (
    <div>
      <PageHeader
        eyebrow="Aktivasi"
        title="Mulai Proses Verifikasi"
        description="Masukkan email Anda untuk memulai proses verifikasi resmi. Kami tidak pernah meminta password, token, atau Magic Link Anda."
      />

      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-14 sm:px-6 lg:grid-cols-[1.1fr_0.9fr]">
        <Card>
          <CardHeader>
            <CardTitle>Form Verifikasi</CardTitle>
            <CardDescription>Proses ini menghubungi integrasi API yang telah dikonfigurasi dan diizinkan.</CardDescription>
          </CardHeader>
          <CardContent>
            {config.isLoading ? (
              <div className="space-y-3">
                <Skeleton className="h-11 w-full" />
                <Skeleton className="h-11 w-32" />
              </div>
            ) : (
              <>
                {!integrationConfigured && (
                  <div className="mb-5 flex items-start gap-3 rounded-[var(--radius-md)] border border-[var(--color-warning)]/30 bg-[var(--color-warning-soft)] p-4 text-sm text-[var(--color-warning)]">
                    <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                    <p>
                      Integrasi API verifikasi belum dikonfigurasi di server ini. Formulir di bawah tetap dapat dicoba,
                      tetapi akan secara jujur melaporkan bahwa belum ada penyedia layanan resmi yang terhubung — bukan
                      keberhasilan palsu.
                    </p>
                  </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
                  <div>
                    <label htmlFor="email" className="mb-1.5 block text-sm font-medium">
                      Alamat Email
                    </label>
                    <div className="relative">
                      <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-ink-subtle)]" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="nama@email.com"
                        className="pl-10"
                        error={errors.email?.message}
                        {...register("email")}
                      />
                    </div>
                    {errors.email && <p className="mt-1.5 text-xs text-[var(--color-danger)]">{errors.email.message}</p>}
                  </div>

                  <Button type="submit" variant="accent" className="w-full" disabled={mutation.isPending}>
                    {mutation.isPending ? (
                      <>
                        <Loader className="h-4 w-4" /> Memproses...
                      </>
                    ) : (
                      "Mulai Verifikasi"
                    )}
                  </Button>
                </form>

                {result && (
                  <div
                    className={
                      "mt-5 flex items-start gap-3 rounded-[var(--radius-md)] border p-4 text-sm " +
                      (result.status === "verified"
                        ? "border-[var(--color-success)]/30 bg-[var(--color-success-soft)] text-[var(--color-success)]"
                        : result.status === "not_configured"
                          ? "border-[var(--color-border-strong)] bg-[var(--color-border)]/30 text-[var(--color-ink-muted)]"
                          : "border-[var(--color-danger)]/30 bg-[var(--color-danger-soft)] text-[var(--color-danger)]")
                    }
                  >
                    {result.status === "verified" ? (
                      <Check className="mt-0.5 h-4 w-4 shrink-0" />
                    ) : (
                      <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                    )}
                    <p>{result.message}</p>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Status Integrasi</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center gap-2 pt-0">
              {config.isLoading ? (
                <Skeleton className="h-6 w-40" />
              ) : (
                <Badge tone={integrationConfigured ? "success" : "warning"}>
                  <StatusDot tone={integrationConfigured ? "success" : "warning"} />
                  {integrationConfigured ? "Terkonfigurasi" : "Belum dikonfigurasi"}
                </Badge>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Alur Proses</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 pt-0 text-sm text-[var(--color-ink-muted)]">
              <Step n={1} text="Masukkan email dan kirim form." />
              <Step n={2} text="Backend memvalidasi ulang dan menghubungi API resmi (jika tersedia)." />
              <Step n={3} text="Anda menyelesaikan autentikasi melalui halaman/email resmi penyedia." />
              <Step n={4} text="Hasil asli — berhasil atau gagal — ditampilkan di sini." />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function Step({ n, text }: { n: number; text: string }) {
  return (
    <div className="flex items-start gap-3">
      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[var(--color-ink)] text-[10px] font-semibold text-[var(--color-canvas)]">
        {n}
      </span>
      <span>{text}</span>
    </div>
  );
}
