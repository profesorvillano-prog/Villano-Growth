-- Grupos de intercambio con macros por porción.
-- Calibrados contra el total de la pauta: 2105 kcal / 147 P / 247 C / 59 G.
insert into minuta_groups (key, label, short_label, sort, color, kcal, protein_g, carbs_g, fat_g, is_free, portion_hint) values
  ('cereales',        'Cereales',                  'Cereal',   1, '#E3A82B', 145, 4,   30, 1,   false, '1 porción ≈ 30 g de carbohidrato (¾ taza de arroz cocido, 1 diente de marraqueta)'),
  ('frutas',          'Frutas',                    'Fruta',    2, '#EF6B5E',  62, 0.5, 15, 0,   false, '1 porción ≈ 15 g de carbohidrato (1 manzana, 2 kiwis, ½ plátano)'),
  ('verduras',        'Verduras',                  'Verdura',  3, '#4FAE63',  28, 2,    5, 0,   false, '1 porción ≈ 1 taza cocida o 2 tazas crudas'),
  ('verduras_libres', 'Verduras de libre consumo', 'V. libre', 4, '#3FBFA8',  10, 1,    2, 0,   true,  'Consumo libre: lechuga, apio, pepino, rabanito, hierbas'),
  ('proteinas',       'Proteínas magras',          'Proteína', 5, '#A57BF0',  58, 10,   0, 2,   false, '1 porción ≈ 10 g de proteína (50 g de carne cocida, 1½ huevos)'),
  ('lacteos',         'Lácteos semidescremados',   'Lácteo',   6, '#57A0EA', 103, 8,   12, 2.5, false, '1 porción ≈ 200 cc de leche o 1 yogur'),
  ('grasas',          'Aceites y grasas',          'Grasa',    7, '#E872B0',  45, 0,    0, 5,   false, '1 porción ≈ 1 cucharadita (5 g) de aceite, 30 g de palta')
on conflict (key) do update set
  label = excluded.label, short_label = excluded.short_label, sort = excluded.sort,
  color = excluded.color, kcal = excluded.kcal, protein_g = excluded.protein_g,
  carbs_g = excluded.carbs_g, fat_g = excluded.fat_g, is_free = excluded.is_free,
  portion_hint = excluded.portion_hint;
