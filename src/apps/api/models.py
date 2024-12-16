from django.db import models

# Create your models here.

class CalcSimple(models.Model):
    id_calc_simple = models.AutoField(primary_key=True)
    produit = models.CharField(max_length=50, blank=True, null=True)
    nb_achats = models.IntegerField(blank=True, null=True)
    nb_ventes = models.IntegerField(blank=True, null=True)
    stock = models.IntegerField(blank=True, null=True)
    prix_unitaire = models.DecimalField(max_digits=15, decimal_places=2, blank=True, null=True)
    ca = models.DecimalField(max_digits=15, decimal_places=2, blank=True, null=True)

    class Meta:
        db_table = 'calc_simple'

class Course(models.Model):
    id_course = models.AutoField(primary_key=True)
    nom = models.CharField(max_length=100, blank=True, null=True)
    prix_15 = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    prix_20 = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)

    class Meta:
        db_table = 'course'

    def __str__(self):
        return self.nom if self.nom else f"Course {self.id_course}"


class Categorie(models.Model):
    id_categorie = models.AutoField(primary_key=True)
    annee = models.DateField(blank=True, null=True)
    code_categorie = models.CharField(max_length=20, blank=True, null=True)

    class Meta:
        db_table = 'categorie'

    def __str__(self):
        return self.code_categorie if self.code_categorie else f"Categorie {self.id_categorie}"


class Coureur(models.Model):
    id_coureur = models.AutoField(primary_key=True)
    nom = models.CharField(max_length=100, blank=True, null=True)
    prenom = models.CharField(max_length=100, blank=True, null=True)
    sexe = models.CharField(max_length=10, blank=True, null=True)
    date_de_naissance = models.DateField(blank=True, null=True)
    categorie = models.ForeignKey(Categorie, on_delete=models.SET_NULL, blank=True, null=True)
    taille_tee_shirt = models.CharField(max_length=10, blank=True, null=True)
    course = models.ForeignKey(Course, on_delete=models.SET_NULL, blank=True, null=True)
    prix_club = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    repas_avant_course = models.BooleanField(default=False, blank=True, null=True)
    prix_du_repas_avant_course = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    repas_apres_course = models.BooleanField(default=False, blank=True, null=True)
    prix_du_repas_apres_course = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    total_coureur = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)

    class Meta:
        db_table = 'coureur'

    def __str__(self):
        return f"{self.nom} {self.prenom}" if self.nom and self.prenom else f"Coureur {self.id_coureur}"

