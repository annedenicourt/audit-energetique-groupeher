import React, { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AuthError } from "@supabase/supabase-js";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, CheckCircle, AlertCircle } from "lucide-react";

const Login: React.FC = () => {
  const { session, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const translateAuthError = (error: AuthError): string => {
    if (!error) return "";

    const code = error.code || "";
    const message = error.message || "";

    // Cas signup désactivé
    if (code === "signup_disabled") {
      return "Accès refusé : cette adresse email n'est pas autorisée";
    }

    // Email invalide
    if (code === "invalid_email") {
      return "Adresse email invalide.";
    }

    // Lien expiré
    if (message.includes("expired")) {
      return "Le lien de connexion a expiré. Merci de demander un nouveau lien";
    }

    // Trop de requêtes
    if (message.includes("rate limit")) {
      return "Trop de tentatives. Merci de réessayer dans quelques minutes";
    }

    // Fallback générique
    return "Une erreur est survenue. Merci de réessayer";
  };


  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (session) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: window.location.origin,
      },
    });

    setSubmitting(false);

    if (error) {
      setError(translateAuthError(error));
    } else {
      setSent(true);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-2">
          <img
            src="/images/logo-blanc-her-enr-.webp"
            alt="Groupe HER-ENR"
            className="h-14 mx-auto rounded-lg bg-primary p-2"
          />
          <CardTitle className="text-2xl">Connexion</CardTitle>

        </CardHeader>
        <CardContent>
          {sent ? (
            <div className="flex flex-col items-center gap-4 py-4 text-center">
              <CheckCircle className="h-12 w-12 text-primary" />
              <p className="text-foreground font-medium">
                Un lien de connexion a été envoyé à <strong>{email}</strong>
              </p>
              <p className="text-sm text-muted-foreground">
                Vérifiez votre boîte de réception et cliquez sur le lien pour vous connecter.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-foreground">
                  Adresse e-mail
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="vous@exemple.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="pl-10"
                  />
                </div>
              </div>

              {error && (
                <div className="flex items-center gap-2 text-sm text-destructive">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <Button type="submit" className="w-full" disabled={submitting}>
                {submitting ? "Envoi en cours…" : "Recevoir un lien de connexion"}
              </Button>

              <p className="text-xs text-center text-muted-foreground">
                Seuls les utilisateurs autorisés peuvent se connecter.
              </p>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
