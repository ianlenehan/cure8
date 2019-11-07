type values = {
  url: string;
  comment?: string;
};

type errors = {
  url?: string;
  comment?: string;
};

export default function validate(values: values) {
  let errors = {} as errors;

  if (!values.url) {
    errors.url = 'Please type in a url';
  }

  return errors;
}
