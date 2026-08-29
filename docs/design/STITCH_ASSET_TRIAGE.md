# Stitch asset triage — WebMCP-QCG

## Scope and custody

Inspected the local archive `asset/.stitch/stitch_webmcp_quantum_call_gate.zip` without publishing or copying its generated screens. The archive remains intact and ignored by Git. Archive facts: 110,473,513 bytes, SHA-256 `3C87306793E161F864701A5E0D7561539A17A6D58B035F5BFCDBCF4E5040FF92`. It contains 113 `screen.png` entries, 58 generated HTML entries, 2 JSON entries and 308 total archive entries.

Archive inspection validated the PNG signature and dimensions for all 113 screen entries without extracting them. The set spans wide desktop compositions (including 1,376×768), portrait/mobile compositions (including 768×1,376), square icon/cover compositions (1,024×1,024), and several generated intermediate canvases. Dimensions were used as a responsive triage signal only; they do not establish product behavior.

The triage is a design decision record, not a claim that Stitch output is production code. “Adopt” means redraw the composition as editable, accessible UI. “Reference” means study a motif or layout only. “Reject” means keep it in the private archive and exclude it from public folders. Raw Stitch screens are not copied into the Winter article or repository public assets.

## Decision summary

- **Adopt (9):** senior-level landing and bounded-state compositions that match the real five-tab workbench and can be redrawn without invented behavior.
- **Reference (91):** workbench state variations, architecture/ingestion/decision diagrams and responsive ideas; reconcile every reference with the live app contract before use.
- **Reject (13):** covers, logos/icons, marketing/social graphics; these are not application UI and do not belong in public folders.
- **Generated HTML:** all 58 HTML entries remain archive-only and are not published. Any visual idea used from them is redrawn.

Reject any visual that adds a fake metric, a provider/QPU claim, an invented date, a network status not present in evidence, or an `Execute` control. Keep the external stage locked and labelled `human controlled`.

## Complete screen manifest

Every screen was inspected by archive entry name and visual role; each appears exactly once below.

| # | Archive screen slug | Decision |
| ---: | --- | --- |
| 001 | `create_a_new_version_of_the_technical_architecture_slide_data_image_image_3` | REFERENCE — inspect composition only; do not copy |
| 002 | `refined_quantum_architecture_variant_1_1` | REFERENCE — inspect composition only; do not copy |
| 003 | `light_mode_version_of_the_refined_deep_inspection_slide_data_image_image_5.` | REFERENCE — inspect composition only; do not copy |
| 004 | `refined_quantum_architecture_variant_1_2` | REFERENCE — inspect composition only; do not copy |
| 005 | `refined_quantum_architecture_variant_1_3` | REFERENCE — inspect composition only; do not copy |
| 006 | `webmcp_qcg_mobile_dark_animated_workbench` | REFERENCE — inspect composition only; do not copy |
| 007 | `refined_system_summary_variant_5` | REFERENCE — inspect composition only; do not copy |
| 008 | `logo_complet.png` | REJECT — promotional/cover/icon asset; never publish |
| 009 | `webmcp_qcg_simulate_first_awaiting_consent_desktop_light` | REFERENCE — inspect composition only; do not copy |
| 010 | `webmcp_qcg_ready_for_external_execution_locked_desktop` | REFERENCE — inspect composition only; do not copy |
| 011 | `webmcp_qcg_active_simulation_desktop_light_animated` | REFERENCE — inspect composition only; do not copy |
| 012 | `a_premium_minimalist_1024x1024_favicon_app_icon_for_webmcp_qcg._the_design` | REJECT — promotional/cover/icon asset; never publish |
| 013 | `light_mode_version_of_the_refined_architecture_ingestion_slide_data_image_image` | REFERENCE — inspect composition only; do not copy |
| 014 | `webmcp_qcg_boundaries_governance_desktop_light_refined` | REFERENCE — inspect composition only; do not copy |
| 015 | `webmcp_qcg_completed_bell_evidence_desktop_light_refined` | REFERENCE — inspect composition only; do not copy |
| 016 | `refined_quantum_architecture_variant_1_4` | REFERENCE — inspect composition only; do not copy |
| 017 | `webmcp_qcg_decision_recompile_mobile_light` | REFERENCE — inspect composition only; do not copy |
| 018 | `refine_the_day_2_decision_engine_slide_by_making_the_central_node_and_outer` | REFERENCE — inspect composition only; do not copy |
| 019 | `webmcp_qcg_workbench_mobile_light_initial` | REFERENCE — inspect composition only; do not copy |
| 020 | `light_mode_version_of_the_refined_decision_core_slide_data_image_image_4.` | REFERENCE — inspect composition only; do not copy |
| 021 | `webmcp_qcg_workbench_desktop_light_initial` | REFERENCE — inspect composition only; do not copy |
| 022 | `light_mode_version_of_the_full_system_field_report_summary_slide._background` | REFERENCE — inspect composition only; do not copy |
| 023 | `marketing_screenshot_1_the_hook_for_the_app_store._a_realistic_smartphone_with` | REJECT — promotional/cover/icon asset; never publish |
| 024 | `webmcp_qcg_decision_recompile_desktop_dark` | REFERENCE — inspect composition only; do not copy |
| 025 | `minimalist_quantum_logic_variant_3` | REFERENCE — inspect composition only; do not copy |
| 026 | `refined_quantum_architecture_variant_1_5` | REFERENCE — inspect composition only; do not copy |
| 027 | `conclusion_slide_variant_5` | REFERENCE — inspect composition only; do not copy |
| 028 | `a_polished_1024x1024_apple_touch_icon_for_webmcp_qcg._minimalist_composition` | REJECT — promotional/cover/icon asset; never publish |
| 029 | `light_mode_version_of_the_refined_secure_execution_slide_data_image_image_3.` | REFERENCE — inspect composition only; do not copy |
| 030 | `refined_quantum_architecture_variant_1_6` | REFERENCE — inspect composition only; do not copy |
| 031 | `webmcp_qcg_ready_for_external_execution_locked_desktop_light` | REFERENCE — inspect composition only; do not copy |
| 032 | `refined_quantum_architecture_variant_1_7` | REFERENCE — inspect composition only; do not copy |
| 033 | `webmcp_qcg_ready_for_external_execution_locked_mobile_light` | REFERENCE — inspect composition only; do not copy |
| 034 | `refined_architecture_ingestion_variant_1` | REFERENCE — inspect composition only; do not copy |
| 035 | `webmcp_qcg_simulate_first_awaiting_consent_desktop` | REFERENCE — inspect composition only; do not copy |
| 036 | `webmcp_qcg_active_simulation_desktop` | REFERENCE — inspect composition only; do not copy |
| 037 | `light_mode_version_of_the_refined_system_summary_slide_data_image_image_2.` | REFERENCE — inspect composition only; do not copy |
| 038 | `refined_quantum_architecture_variant_1_8` | REFERENCE — inspect composition only; do not copy |
| 039 | `light_mode_version_of_the_day_2_decision_engine_slide._background_a_living` | REFERENCE — inspect composition only; do not copy |
| 040 | `a_professional_linkedin_post_visual_for_webmcp_qcg_showcasing_verified` | REJECT — promotional/cover/icon asset; never publish |
| 041 | `webmcp_qcg_boundaries_governance_mobile_light` | REFERENCE — inspect composition only; do not copy |
| 042 | `webmcp_qcg_active_simulation_mobile_light` | REFERENCE — inspect composition only; do not copy |
| 043 | `webmcp_qcg_boundaries_governance_desktop_dark` | REFERENCE — inspect composition only; do not copy |
| 044 | `refined_quantum_architecture_variant_1_9` | REFERENCE — inspect composition only; do not copy |
| 045 | `refined_quantum_architecture_variant_1_10` | REFERENCE — inspect composition only; do not copy |
| 046 | `a_cinematic_ultra_high_definition_marketing_banner_for_webmcp_qcg._the` | REJECT — promotional/cover/icon asset; never publish |
| 047 | `webmcp_qcg_decision_recompile_desktop_light_refined` | REFERENCE — inspect composition only; do not copy |
| 048 | `refined_quantum_architecture_variant_1_11` | REFERENCE — inspect composition only; do not copy |
| 049 | `increase_the_transparency_of_the_golden_nodes_in_the_inspection_phase_slide.` | REFERENCE — inspect composition only; do not copy |
| 050 | `hackathon_intro_slide_variant_1` | REFERENCE — inspect composition only; do not copy |
| 051 | `webmcp_qcg_decision_reject_mobile_light` | REFERENCE — inspect composition only; do not copy |
| 052 | `increase_the_transparency_of_the_brushed_gold_boxes_in_this_architecture` | REFERENCE — inspect composition only; do not copy |
| 053 | `frontcover_en.png_1` | REJECT — promotional/cover/icon asset; never publish |
| 054 | `light_mode_version_of_the_day_1_ingestion_trust_architecture_diagram.` | REFERENCE — inspect composition only; do not copy |
| 055 | `webmcp_qcg_completed_bell_evidence_desktop_light` | REFERENCE — inspect composition only; do not copy |
| 056 | `light_mode_version_of_the_execution_verification_slide._background_lower_gate` | REFERENCE — inspect composition only; do not copy |
| 057 | `webmcp_qcg_decision_reuse_result_mobile_light` | REFERENCE — inspect composition only; do not copy |
| 058 | `webmcp_qcg_how_it_works_desktop_dark` | REFERENCE — inspect composition only; do not copy |
| 059 | `refined_quantum_architecture_variant_1_12` | REFERENCE — inspect composition only; do not copy |
| 060 | `for_the_full_system_field_report_slide_increase_the_transparency_of_the_summary` | REFERENCE — inspect composition only; do not copy |
| 061 | `webmcp_qcg_completed_bell_evidence_desktop` | REFERENCE — inspect composition only; do not copy |
| 062 | `refine_the_colors_of_this_technical_data_flow_diagram_for_securedme_quantum` | REFERENCE — inspect composition only; do not copy |
| 063 | `webmcp_qcg_how_it_works_mobile_dark` | REFERENCE — inspect composition only; do not copy |
| 064 | `webmcp_qcg_completed_bell_evidence_mobile_light` | REFERENCE — inspect composition only; do not copy |
| 065 | `webmcp_qcg_simulate_first_mobile_light_animated` | REFERENCE — inspect composition only; do not copy |
| 066 | `webmcp_qcg_boundaries_governance_mobile_refined` | REFERENCE — inspect composition only; do not copy |
| 067 | `a_highly_detailed_technical_data_flow_diagram_for_securedme_quantum_call_gate.` | REFERENCE — inspect composition only; do not copy |
| 068 | `frontcover_en.png_2` | REJECT — promotional/cover/icon asset; never publish |
| 069 | `mission_and_values_slide_variant_3` | REFERENCE — inspect composition only; do not copy |
| 070 | `technical_architecture_slide_variant_4` | REFERENCE — inspect composition only; do not copy |
| 071 | `refined_quantum_architecture_variant_1_13` | REFERENCE — inspect composition only; do not copy |
| 072 | `backcover_en.png` | REJECT — promotional/cover/icon asset; never publish |
| 073 | `in_the_execution_verification_slide_make_the_gold_box_fills_significantly_more` | REFERENCE — inspect composition only; do not copy |
| 074 | `refined_quantum_architecture_variant_1_14` | REFERENCE — inspect composition only; do not copy |
| 075 | `webmcp_qcg_decision_reject_desktop_dark` | REFERENCE — inspect composition only; do not copy |
| 076 | `refined_decision_core_variant_3` | REFERENCE — inspect composition only; do not copy |
| 077 | `vibrant_data_flow_variant_2` | REFERENCE — inspect composition only; do not copy |
| 078 | `webmcp_qcg_simulate_first_awaiting_consent_mobile_light` | REFERENCE — inspect composition only; do not copy |
| 079 | `webmcp_qcg_workbench_mobile_dark_initial` | REFERENCE — inspect composition only; do not copy |
| 080 | `refined_secure_execution_variant_4` | REFERENCE — inspect composition only; do not copy |
| 081 | `refined_quantum_architecture_variant_1_15` | REFERENCE — inspect composition only; do not copy |
| 082 | `webmcp_qcg_workbench_desktop_dark_initial` | REFERENCE — inspect composition only; do not copy |
| 083 | `webmcp_qcg_active_simulation_desktop_light` | REFERENCE — inspect composition only; do not copy |
| 084 | `webmcp_qcg_decision_reject_desktop_light` | REFERENCE — inspect composition only; do not copy |
| 085 | `a_mobile_optimized_vertical_9_16_version_of_the_technical_architecture_data` | REFERENCE — inspect composition only; do not copy |
| 086 | `marketing_screenshot_2_key_feature_for_the_app_store._a_realistic_smartphone` | REJECT — promotional/cover/icon asset; never publish |
| 087 | `webmcp_qcg_how_it_works_desktop_light` | REFERENCE — inspect composition only; do not copy |
| 088 | `a_high_impact_instagram_marketing_square_for_webmcp_qcg._a_close_up` | REJECT — promotional/cover/icon asset; never publish |
| 089 | `webmcp_qcg_decision_reuse_result_desktop_dark` | REFERENCE — inspect composition only; do not copy |
| 090 | `a_premium_1024x1024_app_icon_for_webmcp_qcg._the_design_features_a_minimalist` | REJECT — promotional/cover/icon asset; never publish |
| 091 | `refined_deep_inspection_variant_2` | REFERENCE — inspect composition only; do not copy |
| 092 | `webmcp_qcg_active_simulation_mobile_light_animated` | REFERENCE — inspect composition only; do not copy |
| 093 | `the_quantum_gate_slide_variant_2` | REFERENCE — inspect composition only; do not copy |
| 094 | `marketing_screenshot_3_visual_polish_for_the_app_store._a_realistic_smartphone` | REJECT — promotional/cover/icon asset; never publish |
| 095 | `refined_quantum_architecture_variant_1_16` | REFERENCE — inspect composition only; do not copy |
| 096 | `light_mode_version_of_the_inspection_phase_slide._background_top_of_the_golden` | REFERENCE — inspect composition only; do not copy |
| 097 | `webmcp_qcg_active_simulation_desktop_dark_animated` | REFERENCE — inspect composition only; do not copy |
| 098 | `webmcp_qcg_active_simulation_mobile_dark_animated_1` | REFERENCE — inspect composition only; do not copy |
| 099 | `webmcp_qcg_active_simulation_mobile_dark_animated_2` | REFERENCE — inspect composition only; do not copy |
| 100 | `webmcp_qcg_active_simulation_mobile_dark_animated_3` | REFERENCE — inspect composition only; do not copy |
| 101 | `webmcp_qcg_active_simulation_mobile_dark_animated_4` | REFERENCE — inspect composition only; do not copy |
| 102 | `a_senior_level_ultra_high_fidelity_desktop_ui_design_for_webmcp_qcg._focus_on` | REFERENCE — inspect composition only; do not copy |
| 103 | `a_senior_level_ultra_premium_desktop_ui_design_for_webmcp_qcg_quantum_call` | REFERENCE — inspect composition only; do not copy |
| 104 | `a_senior_level_ultra_premium_light_mode_desktop_ui_design_for_webmcp_qcg._the` | REFERENCE — inspect composition only; do not copy |
| 105 | `webmcp_qcg_landing_desktop_dark_senior_level` | ADOPT — redraw as editable Winter UI reference |
| 106 | `webmcp_qcg_landing_desktop_light_senior_level` | ADOPT — redraw as editable Winter UI reference |
| 107 | `webmcp_qcg_landing_mobile_dark_senior_level` | ADOPT — redraw as editable Winter UI reference |
| 108 | `webmcp_qcg_landing_mobile_light_senior_level` | ADOPT — redraw as editable Winter UI reference |
| 109 | `webmcp_qcg_simulate_first_awaiting_consent_desktop_dark_senior` | ADOPT — redraw as editable Winter UI reference |
| 110 | `webmcp_qcg_simulate_first_awaiting_consent_desktop_light_senior` | ADOPT — redraw as editable Winter UI reference |
| 111 | `webmcp_qcg_active_simulation_desktop_dark_senior` | ADOPT — redraw as editable Winter UI reference |
| 112 | `webmcp_qcg_completed_bell_evidence_desktop_light_senior` | ADOPT — redraw as editable Winter UI reference |
| 113 | `webmcp_qcg_landing_desktop_light_animated_senior_level` | ADOPT — redraw as editable Winter UI reference |

## Reuse rules

Adopted compositions must preserve exactly five tabs (`Experiment`, `Agent Review`, `Human Decision`, `Evidence Receipt`, `Activity`), exactly four tools, five deterministic hypotheses and the single canonical state. Use the four themes in `DESIGN.md` (Autumn, Winter, Spring, Summer); DevTools is a separate inspection/collaboration architecture, not a theme. Preserve desktop, tablet, mobile and full empty/partial/active/completed/cancelled/error/recovery states, keyboard navigation, focus visibility, reduced-motion behavior and text alternatives.

Before any future asset copy, record source archive path, entry slug, source SHA-256, destination, decision and reviewer. Prefer redrawing in the application or article’s own asset pipeline. Covers and monograph outputs are reserved to Jean-Sébastien.
