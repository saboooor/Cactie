import { configValue } from '~/analysis_config/types';
import createField from './createField';
import { Field } from '~/types/Field';

export default function evalField(fields: Field[], option: configValue[], option_name: string, plugins: any[], server_properties: any, bukkit: any, spigot: any, paper: any, pufferfish: any, purpur: any) {
  const dict_of_vars = { plugins, server_properties, bukkit, spigot, paper, pufferfish, purpur };
  option.forEach(option_data => {
    let add_to_field = true;
    if (option_data.expressions) {
      option_data.expressions.forEach((expression) => {
        Object.keys(dict_of_vars).forEach(config_name => {
          if (expression.vars.includes(config_name) && !dict_of_vars[config_name as keyof typeof dict_of_vars]) add_to_field = false;
        });
        try {
          if (add_to_field && !expression.bool(dict_of_vars)) add_to_field = false;
        }
        catch (err) {
          console.log(err);
          add_to_field = false;
        }
      });
    }
    Object.keys(dict_of_vars).forEach(config_name => {
      if (add_to_field && option_data.value.includes(config_name) && !dict_of_vars[config_name as keyof typeof dict_of_vars]) add_to_field = false;
    });
    if (add_to_field) fields.push(createField({ name: option_name, ...option_data }));
  });
}