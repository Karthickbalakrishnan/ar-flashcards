# Comparative Evaluation Framework

## Study Design: Three-Arm Comparison

This evaluation compares your AR-based learning system against two alternative approaches using a consistent set of pedagogical metrics. The goal is to isolate the contribution of AR and 3D visualization to learning outcomes.

## Conditions

### Condition A: Static 2D Flashcards (Baseline)
**Description**: Traditional digital flashcards presenting molecular structures as 2D line diagrams and health information as text with static images.

**Technology**: Web-based or mobile flashcard interface (e.g., Anki or custom HTML/CSS)

**Instructional content**:
- Molecular structure shown as 2D skeletal formulas or ball-and-stick diagrams
- Health timeline presented as a text-based chronology with static illustrations
- No interactive manipulation or spatial rotation

**Cognitive demand**: Learners must mentally infer 3D structure from 2D projections; timeline requires reading and sequencing from text

**Expected characteristics**:
- Lower working memory support for spatial reasoning
- No embodied interaction
- Lower cognitive load but potentially shallower schema construction

---

### Condition B: Desktop 3D Viewer (ChemDoodle Web or similar)
**Description**: A desktop web application providing 3D molecular visualization with interactive rotation and zoom, paired with a static digital text-based health timeline.

**Technology**: ChemDoodle Web (free educational version), Jmol, or similar open-source 3D chemistry viewer

**Instructional content**:
- Molecules displayed in full 3D with keyboard/mouse controls for rotation and zoom
- Learner can inspect structure from multiple angles on a desktop screen
- Health information presented as text or static diagrams on the same screen or in a separate window
- No AR, no mobile-specific interface, no gesture-based manipulation

**Cognitive demand**: Learners interact with 3D content but must translate mouse/keyboard inputs to mental rotation; abstract desktop interface

**Expected characteristics**:
- Better spatial support than 2D but less immersive than AR
- Some embodied benefit (interactivity) but limited by abstract control scheme
- Moderate cognitive load; good for learning spatial structure
- No temporal embodiment for health timeline

---

### Condition C: Your AR System ✓
**Description**: Mobile AR application integrating 3D molecular visualization in augmented reality and health information presented along a spatial AR timeline.

**Technology**: Your custom AR-flashcards implementation (likely using Three.js, Babylon.js, or native AR framework)

**Instructional content**:
- Molecules rendered in AR space within the learner's physical environment
- Intuitive gesture-based manipulation (pinch to zoom, drag to rotate)
- Health timeline presented as a spatial sequence anchored in AR space
- Learner can walk around, inspect from multiple positions, and temporally sequence events

**Cognitive demand**: Spatial manipulation is direct and embodied; temporal relationships are spatially grounded

**Expected characteristics**:
- Highest embodied cognition support
- Reduced extraneous cognitive load through intuitive gesture control
- Strongest spatial reasoning support
- Temporal grounding supports health literacy and retention

---

## Measurement Metrics

### 1. Learning Gain (Primary Outcome)
**Definition**: Improvement from pre-test to post-test on knowledge of molecular structure and health concepts.

**Instruments**:
- Spatial reasoning test: mental rotation tasks, structure-to-name matching, property prediction
- Health literacy test: concept recall, timeline sequencing, causal reasoning
- Formula: `Gain = Post-test score – Pre-test score`

**Hypothesis**: Condition C (AR) > Condition B (3D desktop) > Condition A (2D flashcards)

### 2. Time-on-Task
**Definition**: Total duration (in minutes) the learner actively engages with the learning material.

**Measurement**: Automated logging of session time, excluding idle periods

**Interpretation**:
- Higher time-on-task may indicate greater engagement but could also indicate inefficiency
- Compare relative to learning gain: is the AR system efficient (high gain per unit time)?
- If Condition C shows high gain with moderate time-on-task, it suggests superior efficiency

**Hypothesis**: Condition C may show similar or slightly lower time-on-task than Condition B (more efficient) but higher than Condition A (more engaging)

### 3. Spatial Reasoning
**Definition**: Performance on spatial visualization tasks specifically, independent of health or chemistry content.

**Instruments**:
- Mental rotation test (MRT): rotate 3D objects and match to target orientations
- Spatial form recognition: identify molecular isomers and conformers
- Perspective-taking: predict how a molecule appears from a different angle

**Hypothesis**: Condition C > Condition B > Condition A, with the largest gap between B and C due to embodied interaction

### 4. Retention (Delayed Post-Test)
**Definition**: Knowledge recall 1-2 weeks after the intervention, with no re-exposure to the material.

**Instruments**:
- Same or parallel form of learning gain test
- Retention score = `Delayed test score`
- Retention rate = `Delayed score / Post-test score`

**Hypothesis**: Condition C shows the highest absolute retention and the lowest decay rate, suggesting deeper encoding

### 5. Cognitive Load (NASA-TLX)
**Definition**: Perceived workload and difficulty of the learning task.

**Measurement**: NASA-TLX questionnaire administered immediately after each condition

**Subscales**:
- Mental demand: how hard did you have to think?
- Physical demand: how physically demanding was the task?
- Temporal demand: did you feel rushed?
- Effort: how hard did you work?
- Frustration: how frustrated or annoyed did you feel?
- Performance: how successful were you?

**Hypothesis**: 
- Condition C: moderate-to-low mental demand, low frustration (intuitive gesture control)
- Condition B: moderate-to-high mental demand (translating mouse to mental rotation), moderate-high frustration
- Condition A: low mental demand but potentially high frustration (limited ability to verify understanding)

### 6. Usability (System Usability Scale)
**Definition**: Perceived ease of use and system quality.

**Measurement**: SUS questionnaire (10 items, 5-point Likert scale)

**Hypothesis**:
- Condition C: high SUS (>68) due to intuitive AR gestures and mobile affordances
- Condition B: moderate SUS (60-70) due to learning curve for 3D controls
- Condition A: high SUS (>75) because flashcards are a familiar paradigm, but potentially lower perceived learning utility

### 7. Engagement and Motivation
**Definition**: Intrinsic interest and perceived value of the learning experience.

**Instruments**:
- Post-intervention survey items: "How interesting was this task?" "Would you use this again?" "How well do you feel you understood the content?"
- Time spent exploring beyond required tasks (if applicable)

**Hypothesis**: Condition C > Condition B > Condition A

---

## Analysis Plan

### Descriptive Statistics
- Report means, standard deviations, and sample sizes for each condition on all metrics
- Check for baseline demographic or pre-test differences

### Comparative Analysis
- **Learning gain**: ANOVA or Kruskal-Wallis test (3 groups)
  - Planned pairwise comparisons: C vs. B, C vs. A, B vs. A
  - Report effect sizes (Cohen's d or eta²)
- **Time-on-task**: one-way ANOVA; interpret alongside learning gain
- **Spatial reasoning**: ANOVA with planned contrasts
- **Retention**: repeated-measures ANOVA (post-test vs. delayed test within each condition)
- **Cognitive load (NASA-TLX)**: ANOVA on overall workload score and individual subscales
- **Usability (SUS)**: ANOVA on composite SUS score
- **Engagement**: Mann-Whitney U tests or ANOVA on Likert responses

### Moderation Analysis (Optional)
- Does the effect of condition vary by prior spatial ability or AR familiarity?
- Does cognitive load mediate the relationship between condition and learning gain?

### Qualitative Analysis
- Thematic analysis of post-task open-ended feedback
- Common barriers, preferences, and user experiences within each condition

---

## Expected Outcomes and Interpretation

| Metric | Condition A (2D) | Condition B (3D Desktop) | Condition C (AR) | Interpretation |
|--------|------------------|--------------------------|------------------|-----------------|
| Learning Gain | Baseline | Moderate improvement | **Highest** | 3D + embodiment supports understanding |
| Spatial Reasoning | Baseline | Good improvement | **Highest** | AR physicality enhances spatial reasoning |
| Retention | Baseline | Good | **Highest** | Embodied learning encodes deeply |
| Time-on-Task | Low–Moderate | Moderate–High | Moderate | AR is efficient (gain per unit time) |
| Cognitive Load | Low | Moderate | Low–Moderate | AR gestures are intuitive; minimal extraneous load |
| Usability (SUS) | High (familiar) | Moderate (learning curve) | High (intuitive) | AR provides familiar mobile interaction |
| Engagement | Low–Moderate | Moderate | **High** | AR is novel and spatially immersive |

### Interpretation Framework
- **If C > B > A across all metrics**: AR is superior to both alternatives; justify investment in AR platform
- **If C ≈ B on learning but C > B on engagement**: AR may improve motivation without compromising learning; consider for classroom adoption
- **If B and C differ only in engagement/usability**: A low-cost desktop 3D viewer may be sufficient for some use cases; AR adds engagement value
- **If A performs unexpectedly well**: Reassess assumptions about spatial reasoning importance; consider hybrid approaches

---

## Study Logistics

### Participant Assignment
- Random assignment to condition (n = 10–15 per condition for pilot; n = 30–50 per condition for full study)

### Counterbalancing
- If participants complete multiple learning tasks, randomize order of tasks within each condition to avoid order effects

### Session Structure
- Baseline demographics and pre-test (~15 min)
- Assigned condition learning session (~30–45 min)
- Post-test and questionnaires (~15 min)
- Delayed test and follow-up (~15 min, conducted 1–2 weeks later)

### Data Collection and Privacy
- Anonymize all responses and link to participant ID only
- Secure video recordings of AR sessions (if consent obtained) for qualitative analysis
- Exclude personal identifiers from all analysis and reporting

---

## Deliverables
1. Parallel pre- and post-test instruments validated for reliability
2. Baseline demographic questionnaire
3. Session logs and time-on-task data for each participant
4. NASA-TLX and SUS responses for each condition
5. Delayed retention test data
6. Qualitative feedback and interview transcripts
7. Summary table and figures comparing conditions on all metrics
8. Effect sizes and confidence intervals for primary outcomes
9. Narrative report interpreting results in light of theory and prior literature

This framework provides a rigorous foundation for demonstrating whether AR and 3D visualization offer meaningful learning advantages over conventional approaches.
