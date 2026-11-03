import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { PageHeader } from "~/components/sections/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Badge, StatusDot } from "~/components/ui/badge";
import { Skeleton } from "~/components/ui/skeleton";
import { Button } from "~/components/ui/button";
import { getStatus, getHealth } from "~/lib/api/client";

export const Route = createFileRoute("/status")({
  component: StatusPage,
});

function toneFor(value: string): "success" | "warning" | "danger" | "neutral" {
  if (["ok", "connected", "verified"].includes(value)) return "success";
  if (["degraded", "not_configured", "unreachable"].includes(value)) return "warning";
  if (["down", "failed"].includes(value)) return "danger";
  return "neutral";
}

function StatusPage() {
  const status = useQuery({
    queryKey: ["status"],
    queryFn: getStatus,
    refetchInterval: 15_000,
  });

  const health = useQuery({
    queryKey: ["health"],
    queryFn: getHealth,
    refetchInterval: 15_000,
  });

  const isLoading = status.isLoading || health.isLoading;
  const isError = status.isError || health.isError;

  return (
    <div>
      <PageHeader
        eyebrow="Status"
        title="Status Layanan"
        description="Data di halaman ini diambil langsung dari backend — diperbarui otomatis setiap 15 detik."
        action={
          <Button variant="outline" size="sm" onClick={() => { status.refetch(); health.refetch(); }}>
            Perbarui sekarang
          </Button>
        }
      />

      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        {isError && (
          <div className="mb-8 rounded-[var(--radius-md)] border border-[var(--color-danger)]/30 bg-[var(--color-danger-soft)] p-4 text-sm text-[var(--color-danger)]">
            Gagal mengambil status dari server. Backend mungkin sedang tidak dapat dijangkau.
          </div>
        )}

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <StatusCard
            label="Status Server"
            loading={isLoading}
            value={status.data?.server}
          />
          <StatusCard
            label="Integrasi API"
            loading={isLoading}
            value={status.data?.apiIntegration}
          />
          <MetricCard
            label="Waktu Respons"
            loading={isLoading}
            value={status.data?.responseTimeMs != null ? `${status.data.responseTimeMs} ms` : "—"}
          />
          <MetricCard
            label="Uptime"
            loading={isLoading}
            value={health.data ? formatUptime(health.data.uptimeSeconds) : "—"}
          />
        </div>

        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="text-base">Detail</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 pt-0 text-sm">
            {isLoading ? (
              <>
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-4 w-1/3" />
              </>
            ) : (
              <>
                <DetailRow label="Pesan" value={status.data?.message ?? "—"} />
                <DetailRow label="Versi Aplikasi" value={health.data?.version ?? "—"} />
                <DetailRow
                  label="Terakhir Diperbarui"
                  value={status.data ? new Date(status.data.timestamp).toLocaleString("id-ID") : "—"}
                />
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function StatusCard({ label, loading, value }: { label: string; loading: boolean; value?: string }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-xs font-medium uppercase tracking-wide text-[var(--color-ink-muted)]">
          {label}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        {loading || !value ? (
          <Skeleton className="h-6 w-24" />
        ) : (
          <Badge tone={toneFor(value)}>
            <StatusDot tone={toneFor(value)} />
            {formatValue(value)}
          </Badge>
        )}
      </CardContent>
    </Card>
  );
}

function MetricCard({ label, loading, value }: { label: string; loading: boolean; value: string }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-xs font-medium uppercase tracking-wide text-[var(--color-ink-muted)]">
          {label}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        {loading ? <Skeleton className="h-6 w-20" /> : <p className="text-xl font-semibold">{value}</p>}
      </CardContent>
    </Card>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-[var(--color-border)] py-2 last:border-0">
      <span className="text-[var(--color-ink-muted)]">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}

function formatValue(value: string): string {
  const map: Record<string, string> = {
    ok: "Normal",
    degraded: "Terdegradasi",
    down: "Tidak Aktif",
    connected: "Terhubung",
    not_configured: "Belum Dikonfigurasi",
    unreachable: "Tidak Terjangkau",
  };
  return map[value] ?? value;
}

function formatUptime(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  return `${h}j ${m}m ${s}d`;
}
