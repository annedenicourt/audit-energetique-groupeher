import { Activity, AlertTriangle, BarChart3, Clock, FileText, Home, TrendingUp, Users, Wrench } from "lucide-react";
import { Card, CardContent } from "../ui/card";
import AdminActivityChart from "./AdminActivityChart";
import { FormData } from "@/types/formData";
import { useMemo } from "react";
import { Json } from "@/integrations/supabase/types";

interface Study {
  id: string;
  user_id: string;
  client_name: string | null;
  created_at: string;
  payload: Json | null
}

interface Profile {
  id: string;
  display_name: string | null;
  role: string;
}

interface Props {
  studyCount: number;
  profileCount: number;
  recentStudies: Study[];
  profiles: Profile[];
  allStudies: Study[];
  setView: React.Dispatch<React.SetStateAction<string>>;
}

const toNumber = (value?: string | null): number | null => {
  if (!value) return null;
  const normalized = value.replace(",", ".").replace(/[^\d.-]/g, "");
  const num = Number(normalized);
  return Number.isFinite(num) ? num : null;
};

const getDominantEntry = (record: Record<string, number>): string => {
  const sorted = Object.entries(record)
    .filter(([key]) => key.trim() !== "")
    .sort((a, b) => b[1] - a[1]);

  return sorted[0]?.[0] ?? "Non renseigné";
};

const inc = (record: Record<string, number>, key: string) => {
  if (!key.trim()) return;
  record[key] = (record[key] ?? 0) + 1;
};

const AdminDashboardView: React.FC<Props> = ({ studyCount, profileCount, recentStudies, profiles, setView, allStudies }) => {
  const profileMap = new Map(profiles.map((p) => [p.id, p.display_name ?? "Inconnu"]));

  const formatDateTime = (d: string) => {
    const date = new Date(d);
    return {
      date: date.toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit", year: "numeric" }),
      time: date.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }),
    };
  };

  //const commerciaux = profiles.filter((p) => p.role === "commercial");

  const PROJECT_KEYS = [
    "pacAirEau",
    "pacAirAir",
    "photovoltaique",
    "isolation",
    "ite",
    "menuiseries",
    "vmc",
    "thermodynamique",
    "poele",
    "multiplus",
    "ecsSolaire",
    "ssc",
    "autreProduit",
  ] as const;

  type ProjectKey = (typeof PROJECT_KEYS)[number];

  const createProjectCounts = () => ({
    pacAirEau: 0,
    pacAirAir: 0,
    photovoltaique: 0,
    isolation: 0,
    ite: 0,
    menuiseries: 0,
    vmc: 0,
    thermodynamique: 0,
    poele: 0,
    multiplus: 0,
    ecsSolaire: 0,
    ssc: 0,
    autreProduit: 0,
    multiProduits: 0,
    nonRenseigne: 0,
  });

  const getSelectedProjectKeys = (
    selected?: Partial<Record<ProjectKey, boolean>>
  ): ProjectKey[] => PROJECT_KEYS.filter((key) => selected?.[key]);

  const updateRanking = (
    rankingMap: Map<
      string,
      {
        userId: string;
        name: string;
        total: number;
        last7Days: number;
        last30Days: number;
      }
    >,
    study: { user_id: string; created_at: string },
    profileMap: Map<string, string>,
    sevenDaysAgo: Date,
    thirtyDaysAgo: Date
  ) => {
    const createdAt = new Date(study.created_at);

    const item = rankingMap.get(study.user_id) ?? {
      userId: study.user_id,
      name: profileMap.get(study.user_id) ?? "Inconnu",
      total: 0,
      last7Days: 0,
      last30Days: 0,
    };

    item.total += 1;
    if (createdAt >= sevenDaysAgo) item.last7Days += 1;
    if (createdAt >= thirtyDaysAgo) item.last30Days += 1;

    rankingMap.set(study.user_id, item);
  };

  const stats = useMemo(() => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const sevenDaysAgo = new Date(now);
    sevenDaysAgo.setDate(now.getDate() - 7);
    const thirtyDaysAgo = new Date(now);
    thirtyDaysAgo.setDate(now.getDate() - 30);

    const projectCounts = createProjectCounts();
    const heatingCounts: Record<string, number> = {};
    const aerationCounts: Record<string, number> = {};
    const energyClassCounts: Record<string, number> = {};

    let totalSurface = 0;
    let surfaceCount = 0;
    let totalYear = 0;
    let yearCount = 0;
    let studiesWithoutClient = 0;
    let studiesWithoutProjectType = 0;
    let incompleteTechnicalStudies = 0;

    const rankingMap = new Map<
      string,
      {
        userId: string;
        name: string;
        total: number;
        last7Days: number;
        last30Days: number;
      }
    >();

    profiles.forEach((profile) => {
      rankingMap.set(profile.id, {
        userId: profile.id,
        name: profile.display_name ?? "Inconnu",
        total: 0,
        last7Days: 0,
        last30Days: 0,
      });
    });

    allStudies.forEach((study) => {
      const payload = study.payload as unknown as FormData | null;
      const client = payload?.client;
      const bilan = payload?.bilan;
      const selectedKeys = getSelectedProjectKeys(
        payload?.dimensionnement?.selectedSections
      );

      if (!study.client_name?.trim()) studiesWithoutClient++;

      if (selectedKeys.length === 0) {
        projectCounts.nonRenseigne++;
        studiesWithoutProjectType++;
      } else {
        selectedKeys.forEach((key) => {
          projectCounts[key]++;
        });

        if (selectedKeys.length > 1) {
          projectCounts.multiProduits++;
        }
      }

      const surface = toNumber(client?.surfaceHabitable);
      if (surface > 0) {
        totalSurface += surface;
        surfaceCount++;
      }

      const year = toNumber(client?.anneeConstruction);
      if (year > 1800 && year <= currentYear) {
        totalYear += year;
        yearCount++;
      }

      inc(heatingCounts, client?.typeChauffage ?? "");
      inc(aerationCounts, client?.typeAeration ?? "");
      inc(energyClassCounts, bilan?.classeEnergetique ?? "");

      const missingTechnicalData =
        !client?.surfaceHabitable?.trim() ||
        !client?.anneeConstruction?.trim() ||
        !client?.typeChauffage?.trim() ||
        !client?.typeAeration?.trim();

      if (missingTechnicalData) {
        incompleteTechnicalStudies++;
      }

      updateRanking(rankingMap, study, profileMap, sevenDaysAgo, thirtyDaysAgo);
    });

    const ranking = Array.from(rankingMap.values()).sort((a, b) => {
      if (b.total !== a.total) return b.total - a.total;
      if (b.last30Days !== a.last30Days) return b.last30Days - a.last30Days;
      return b.last7Days - a.last7Days;
    });

    return {
      projectCounts,
      avgSurface: surfaceCount > 0 ? Math.round(totalSurface / surfaceCount) : null,
      avgYear: yearCount > 0 ? Math.round(totalYear / yearCount) : null,
      dominantHeating: getDominantEntry(heatingCounts),
      dominantAeration: getDominantEntry(aerationCounts),
      dominantEnergyClass: getDominantEntry(energyClassCounts),
      ranking,
      inactiveProfiles: ranking.filter((item) => item.last30Days === 0),
      studiesWithoutClient,
      studiesWithoutProjectType,
      incompleteTechnicalStudies,
    };
  }, [allStudies, profiles, profileMap]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Tableau de bord</h1>
        <p className="text-sm text-muted-foreground mt-1">Vue d'ensemble de l'activité</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-5 flex items-center gap-4">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <FileText className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Études réalisées</p>
              <p className="text-2xl font-bold text-foreground">{studyCount}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5 flex items-center gap-4">
            <div className="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center">
              <Users className="h-5 w-5 text-accent" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Commerciaux</p>
              <p className="text-2xl font-bold text-foreground">{profileCount}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5 flex items-center gap-4">
            <div className="h-10 w-10 rounded-lg bg-secondary flex items-center justify-center">
              <Activity className="h-5 w-5 text-secondary-foreground" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Statut</p>
              <p className="text-sm font-semibold text-foreground">Opérationnel</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <AdminActivityChart studies={allStudies} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-5 space-y-4">
            <div className="flex items-center gap-2">
              <Wrench className="h-5 w-5 text-primary" />
              <div>
                <h2 className="text-lg font-semibold text-foreground">Répartition des projets</h2>
                <p className="text-sm text-muted-foreground">Produits les plus étudiés</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-lg border p-3 flex justify-between">
                <span>PAC air/eau</span>
                <span className="font-semibold">{stats.projectCounts.pacAirEau}</span>
              </div>
              <div className="rounded-lg border p-3 flex justify-between">
                <span>PAC air/air</span>
                <span className="font-semibold">{stats.projectCounts.pacAirAir}</span>
              </div>
              <div className="rounded-lg border p-3 flex justify-between">
                <span>Photovoltaïque</span>
                <span className="font-semibold">{stats.projectCounts.photovoltaique}</span>
              </div>
              <div className="rounded-lg border p-3 flex justify-between">
                <span>Isolation</span>
                <span className="font-semibold">{stats.projectCounts.isolation}</span>
              </div>
              <div className="rounded-lg border p-3 flex justify-between">
                <span>ITE</span>
                <span className="font-semibold">{stats.projectCounts.ite}</span>
              </div>
              <div className="rounded-lg border p-3 flex justify-between">
                <span>Menuiseries</span>
                <span className="font-semibold">{stats.projectCounts.menuiseries}</span>
              </div>
              <div className="rounded-lg border p-3 flex justify-between">
                <span>VMC</span>
                <span className="font-semibold">{stats.projectCounts.vmc}</span>
              </div>
              <div className="rounded-lg border p-3 flex justify-between">
                <span>Autre produit</span>
                <span className="font-semibold">{stats.projectCounts.autreProduit}</span>
              </div>
              <div className="rounded-lg border p-3 flex justify-between col-span-2">
                <span>Études multi-produits</span>
                <span className="font-semibold">{stats.projectCounts.multiProduits}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5 space-y-4">
            <div className="flex items-center gap-2">
              <Home className="h-5 w-5 text-primary" />
              <div>
                <h2 className="text-lg font-semibold text-foreground">Données techniques</h2>
                <p className="text-sm text-muted-foreground">Tendances globales des études</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="rounded-lg border p-3 flex items-center justify-between">
                <span className="text-sm">Surface habitable moyenne</span>
                <span className="font-semibold">
                  {stats.avgSurface ? `${stats.avgSurface} m²` : "Non renseigné"}
                </span>
              </div>
              <div className="rounded-lg border p-3 flex items-center justify-between">
                <span className="text-sm">Année de construction moyenne</span>
                <span className="font-semibold">
                  {stats.avgYear ?? "Non renseigné"}
                </span>
              </div>
              <div className="rounded-lg border p-3 flex items-center justify-between">
                <span className="text-sm">Chauffage dominant</span>
                <span className="font-semibold">{stats.dominantHeating}</span>
              </div>
              <div className="rounded-lg border p-3 flex items-center justify-between">
                <span className="text-sm">Aération dominante</span>
                <span className="font-semibold">{stats.dominantAeration}</span>
              </div>
              <div className="rounded-lg border p-3 flex items-center justify-between">
                <span className="text-sm">Classe énergétique dominante</span>
                <span className="font-semibold">{stats.dominantEnergyClass}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-5 space-y-4">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              <div>
                <h2 className="text-lg font-semibold text-foreground">Classement production</h2>
                <p className="text-sm text-muted-foreground">Basé sur le nombre d'études</p>
              </div>
            </div>

            <div className="space-y-3">
              {stats.ranking.length === 0 ? (
                <p className="text-sm text-muted-foreground">Aucune donnée disponible</p>
              ) : (
                stats.ranking.slice(0, 8).map((item, index) => (
                  <div
                    key={item.userId}
                    className="rounded-lg border p-3 flex items-center justify-between"
                  >
                    <div>
                      <p className="text-sm font-medium">
                        #{index + 1} — {item.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        7 j : {item.last7Days} · 30 j : {item.last30Days}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-foreground">{item.total}</p>
                      <p className="text-xs text-muted-foreground">études</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5 space-y-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-primary" />
              <div>
                <h2 className="text-lg font-semibold text-foreground">Alertes utiles</h2>
                <p className="text-sm text-muted-foreground">Points de vigilance</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="rounded-lg border p-3">
                <p className="text-sm text-muted-foreground">Commerciaux inactifs sur 30 jours</p>
                <p className="text-2xl font-bold">{stats.inactiveProfiles.length}</p>
              </div>

              <div className="rounded-lg border p-3">
                <p className="text-sm text-muted-foreground">Études sans nom client</p>
                <p className="text-2xl font-bold">{stats.studiesWithoutClient}</p>
              </div>

              <div className="rounded-lg border p-3">
                <p className="text-sm text-muted-foreground">Études sans produit sélectionné</p>
                <p className="text-2xl font-bold">{stats.studiesWithoutProjectType}</p>
              </div>

              <div className="rounded-lg border p-3">
                <p className="text-sm text-muted-foreground">Études avec données techniques incomplètes</p>
                <p className="text-2xl font-bold">{stats.incompleteTechnicalStudies}</p>
              </div>

              {stats.inactiveProfiles.length > 0 && (
                <div className="rounded-lg border p-3">
                  <p className="text-sm font-medium mb-2">Profils inactifs</p>
                  <div className="space-y-1">
                    {stats.inactiveProfiles.slice(0, 5).map((profile) => (
                      <p key={profile.userId} className="text-sm text-muted-foreground">
                        {profile.name}
                      </p>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Dernières études */}
      <div>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground ">Dernières études réalisées</h2>
          <button
            type="button"
            onClick={() => setView("documents")}
            className="text-sm font-semibold underline-offset-4 hover:underline bg-transparent border-0 p-0 cursor-pointer"
          >
            Voir tous les documents
          </button>
        </div>
        {recentStudies.length === 0 ? (
          <Card>
            <CardContent className="p-6 flex flex-col items-center justify-center text-center gap-2 min-h-[120px]">
              <TrendingUp className="h-8 w-8 text-muted-foreground/40" />
              <p className="text-sm text-muted-foreground">Aucune étude pour le moment</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
            {recentStudies.map((study) => {
              const { date, time } = formatDateTime(study.created_at);
              return (
                <Card key={study.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4 space-y-2">
                    <p className="font-medium text-foreground truncate text-sm">
                      {study.client_name || "Client non renseigné"}                    </p>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Clock className="h-3.5 w-3.5 shrink-0" />
                      <span>{date} à {time}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Users className="h-3.5 w-3.5 shrink-0" />
                      <span className="truncate">{profileMap.get(study.user_id) ?? "Inconnu"}</span>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
export default AdminDashboardView;