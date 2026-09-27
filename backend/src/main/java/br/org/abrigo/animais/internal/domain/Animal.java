package br.org.abrigo.animais.internal.domain;

import br.org.abrigo.animais.Especie;
import br.org.abrigo.animais.Sexo;
import br.org.abrigo.animais.SituacaoAnimal;
import br.org.abrigo.plataforma.EntidadeBase;
import br.org.abrigo.plataforma.RegraNegocioException;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OrderBy;
import jakarta.persistence.Table;
import org.hibernate.annotations.BatchSize;

import java.time.Instant;
import java.time.LocalDate;
import java.time.Period;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * Animal do abrigo. As REGRAS ficam aqui (não no controller, nem no service):
 * assim são testadas com JUnit puro, sem subir Spring nem banco (ver AnimalTest).
 */
@Entity
@Table(name = "animal")
public class Animal extends EntidadeBase {

    public static final int MAXIMO_FOTOS = 10;

    @Column(nullable = false, length = 120)
    private String nome;

    /** Identificador da URL pública. Não muda quando o nome é editado (links compartilhados continuam valendo). */
    @Column(nullable = false, length = 160, updatable = false)
    private String slug;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private Especie especie;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private Sexo sexo;

    @Column(length = 80)
    private String cor;

    private LocalDate dataNascimentoEstimada;

    @Column(nullable = false)
    private boolean castrado;

    @Column(length = 40)
    private String chip;

    @Column(length = 40)
    private String canil;

    @Column(length = 40)
    private String ala;

    @Column(nullable = false)
    private boolean idoso;

    @Column(nullable = false)
    private boolean medicacaoContinua;

    @Column(columnDefinition = "text")
    private String descricao;

    /** Ficha descritiva de saúde (RF-08). Texto livre, pública. NÃO é prontuário. */
    @Column(columnDefinition = "text")
    private String medicacoes;

    @Column(columnDefinition = "text")
    private String condicoesSaude;

    @Column(columnDefinition = "text")
    private String vacinas;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private SituacaoAnimal situacao;

    private LocalDate dataObito;

    @Column(nullable = false)
    private boolean visivelNaVitrine;

    @OneToMany(mappedBy = "animal", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("ordem ASC")
    @BatchSize(size = 50)
    private List<FotoAnimal> fotos = new ArrayList<>();

    protected Animal() {
        // exigido pelo JPA
    }

    // ------------------------------------------------------------------ criação e edição

    public static Animal cadastrar(DadosAnimal dados) {
        Animal a = new Animal();
        a.aplicar(dados);
        a.slug = Slugs.gerar(a.nome, a.getId());
        a.situacao = SituacaoAnimal.DISPONIVEL;
        a.visivelNaVitrine = true;
        return a;
    }

    public void atualizar(DadosAnimal dados) {
        aplicar(dados);
    }

    private void aplicar(DadosAnimal d) {
        if (d.nome() == null || d.nome().isBlank()) {
            throw new RegraNegocioException("O nome do animal é obrigatório.");
        }
        if (d.especie() == null) {
            throw new RegraNegocioException("A espécie do animal é obrigatória.");
        }
        this.nome = d.nome().trim();
        this.especie = d.especie();
        this.sexo = d.sexo() == null ? Sexo.INDEFINIDO : d.sexo();
        this.cor = limpar(d.cor());
        this.dataNascimentoEstimada = d.dataNascimentoEstimada();
        this.castrado = d.castrado();
        this.chip = limpar(d.chip());
        this.canil = limpar(d.canil());
        this.ala = limpar(d.ala());
        this.idoso = d.idoso();
        this.medicacaoContinua = d.medicacaoContinua();
        this.descricao = limpar(d.descricao());
        this.medicacoes = limpar(d.medicacoes());
        this.condicoesSaude = limpar(d.condicoesSaude());
        this.vacinas = limpar(d.vacinas());
    }

    // ------------------------------------------------------------------ situação

    public void alterarSituacao(SituacaoAnimal nova) {
        if (nova == null) {
            throw new RegraNegocioException("Informe a nova situação.");
        }
        if (this.situacao == SituacaoAnimal.OBITO) {
            throw new RegraNegocioException("Um animal com óbito registrado não pode mudar de situação.");
        }
        if (nova == SituacaoAnimal.OBITO) {
            throw new RegraNegocioException("Use o registro de óbito para informar o falecimento.");
        }
        this.situacao = nova;
    }

    /** Óbito é estado final: some da vitrine e não aceita novos apadrinhamentos. */
    public void registrarObito(LocalDate data, LocalDate hoje) {
        if (this.situacao == SituacaoAnimal.OBITO) {
            throw new RegraNegocioException("O óbito deste animal já foi registrado.");
        }
        if (data == null || data.isAfter(hoje)) {
            throw new RegraNegocioException("A data do óbito é obrigatória e não pode ser futura.");
        }
        this.situacao = SituacaoAnimal.OBITO;
        this.dataObito = data;
        this.visivelNaVitrine = false;
    }

    // ------------------------------------------------------------------ vitrine

    public void publicarNaVitrine() {
        if (this.situacao == SituacaoAnimal.OBITO) {
            throw new RegraNegocioException("Um animal com óbito registrado não pode aparecer na vitrine.");
        }
        this.visivelNaVitrine = true;
    }

    public void ocultarDaVitrine() {
        this.visivelNaVitrine = false;
    }

    public boolean estaNaVitrine() {
        return visivelNaVitrine && situacao != SituacaoAnimal.OBITO;
    }

    // ------------------------------------------------------------------ fotos

    public FotoAnimal adicionarFoto(String chaveArquivo, Instant agora) {
        if (fotos.size() >= MAXIMO_FOTOS) {
            throw new RegraNegocioException("Limite de " + MAXIMO_FOTOS + " fotos por animal atingido.");
        }
        int proximaOrdem = fotos.stream().mapToInt(FotoAnimal::getOrdem).max().orElse(-1) + 1;
        FotoAnimal foto = new FotoAnimal(this, chaveArquivo, proximaOrdem, fotos.isEmpty(), agora);
        fotos.add(foto);
        return foto;
    }

    /** Remove a foto e devolve a chave do arquivo (para apagar do armazenamento). */
    public String removerFoto(UUID fotoId) {
        FotoAnimal foto = buscarFoto(fotoId);
        fotos.remove(foto);
        if (foto.isPrincipal() && !fotos.isEmpty()) {
            fotos.get(0).marcarPrincipal(true);
        }
        return foto.getChaveArquivo();
    }

    public void definirFotoPrincipal(UUID fotoId) {
        FotoAnimal escolhida = buscarFoto(fotoId);
        fotos.forEach(f -> f.marcarPrincipal(f.equals(escolhida)));
    }

    public Optional<FotoAnimal> fotoPrincipal() {
        return fotos.stream().filter(FotoAnimal::isPrincipal).findFirst();
    }

    private FotoAnimal buscarFoto(UUID fotoId) {
        return fotos.stream()
                .filter(f -> f.getId().equals(fotoId))
                .findFirst()
                .orElseThrow(() -> new RegraNegocioException("Foto não pertence a este animal."));
    }

    // ------------------------------------------------------------------ consultas

    public Integer idadeEmAnos(LocalDate hoje) {
        if (dataNascimentoEstimada == null) {
            return null;
        }
        return Period.between(dataNascimentoEstimada, hoje).getYears();
    }

    public boolean podeSerApadrinhado() {
        return situacao != SituacaoAnimal.OBITO;
    }

    private static String limpar(String valor) {
        return valor == null || valor.isBlank() ? null : valor.trim();
    }

    // ------------------------------------------------------------------ getters

    public String getNome() { return nome; }
    public String getSlug() { return slug; }
    public Especie getEspecie() { return especie; }
    public Sexo getSexo() { return sexo; }
    public String getCor() { return cor; }
    public LocalDate getDataNascimentoEstimada() { return dataNascimentoEstimada; }
    public boolean isCastrado() { return castrado; }
    public String getChip() { return chip; }
    public String getCanil() { return canil; }
    public String getAla() { return ala; }
    public boolean isIdoso() { return idoso; }
    public boolean isMedicacaoContinua() { return medicacaoContinua; }
    public String getDescricao() { return descricao; }
    public String getMedicacoes() { return medicacoes; }
    public String getCondicoesSaude() { return condicoesSaude; }
    public String getVacinas() { return vacinas; }
    public SituacaoAnimal getSituacao() { return situacao; }
    public LocalDate getDataObito() { return dataObito; }
    public boolean isVisivelNaVitrine() { return visivelNaVitrine; }
    public List<FotoAnimal> getFotos() { return Collections.unmodifiableList(fotos); }
}
