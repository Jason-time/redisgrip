import React, { Fragment, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import TreeView from '@material-ui/lab/TreeView';
import TreeItem from '@material-ui/lab/TreeItem';
import Typography from '@material-ui/core/Typography';
import Label from '@material-ui/icons/Label';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';
import { useDispatch, useSelector } from 'react-redux';
import VpnKeyOutlinedIcon from '@material-ui/icons/VpnKeyOutlined';
import { selectKey } from '../servers/selectedSlice';

const useTreeItemStyles = makeStyles((theme) => ({
  root: {
    color: theme.palette.text.secondary,
    '&:hover > $content': {
      backgroundColor: theme.palette.action.hover,
    },
    '&:focus > $content, &$selected > $content': {
      backgroundColor: `var(--tree-view-bg-color, ${theme.palette.grey[400]})`,
      color: 'var(--tree-view-color)',
    },
    '&:focus > $content $label, &:hover > $content $label, &$selected > $content $label': {
      backgroundColor: 'transparent',
    },
  },
  content: {
    color: theme.palette.text.secondary,
    borderTopRightRadius: theme.spacing(2),
    borderBottomRightRadius: theme.spacing(2),
    paddingRight: theme.spacing(1),
    fontWeight: theme.typography.fontWeightMedium,
    '$expanded > &': {
      fontWeight: theme.typography.fontWeightRegular,
    },
  },
  group: {
    marginLeft: 0,
    '& $content': {
      paddingLeft: theme.spacing(2),
    },
  },
  expanded: {},
  selected: {},
  label: {
    fontWeight: 'inherit',
    color: 'inherit',
  },
  labelRoot: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0.5, 0),
  },
  labelIcon: {
    marginRight: theme.spacing(1),
  },
  labelText: {
    fontWeight: 'inherit',
    flexGrow: 1,
  },
}));

function StyledTreeItem(props) {
  const classes = useTreeItemStyles();
  const {
    labelText,
    labelIcon: LabelIcon,
    labelInfo,
    color,
    bgColor,
    ...other
  } = props;

  return (
    <TreeItem
      label={
        <div className={classes.labelRoot}>
          <LabelIcon color="inherit" className={classes.labelIcon} />
          <Typography variant="body2" className={classes.labelText}>
            {labelText}
          </Typography>
          <Typography variant="caption" color="inherit">
            {labelInfo}
          </Typography>
        </div>
      }
      style={{
        '--tree-view-color': color,
        '--tree-view-bg-color': bgColor,
      }}
      classes={{
        root: classes.root,
        content: classes.content,
        expanded: classes.expanded,
        selected: classes.selected,
        group: classes.group,
        label: classes.label,
      }}
      {...other}
    />
  );
}

StyledTreeItem.propTypes = {
  bgColor: PropTypes.string,
  color: PropTypes.string,
  labelIcon: PropTypes.elementType.isRequired,
  labelInfo: PropTypes.string,
  labelText: PropTypes.string.isRequired,
};

const useStyles = makeStyles({
  root: {
    height: 264,
    flexGrow: 1,
    maxWidth: 400,
  },
});

export default function GroupKeys() {
  const classes = useStyles();
  const dispatch = useDispatch();

  const keys = useSelector((state) => state.keys);

  const onSelectKey = async (key) => {
    console.log(`GroupKeys onSelectKey key=${key}`);
    await dispatch(selectKey({ key }));
  };


  const onSelectGroupKey = async (groupKey) => {
    console.log(`GroupKeys:onSelectGroupKey() ${groupKey}`);
  };

  const sample = [
    { key: 'a123', count: 1, deleted: false },
    { key: 'bfds', count: 1, deleted: false },
    { key: 'c_1', count: 1, deleted: false },
    { key: 'c_2', count: 1, deleted: false },
    { key: 'd_1', count: 1, deleted: false },
    { key: 'd_2', count: 1, deleted: false },
  ];

  const getGroups = (param) => {
    const tmp = param.reduce((acc, item) => {
      const prefix = item.key.split('_')[0];
      // console.log(`prefix=${JSON.stringify(prefix)}`);

      if (!acc[prefix]) {
        acc[prefix] = [];
      }
      acc[prefix].push(item);
      return acc;
    }, {});

    return tmp;
  };

  const newGroups = useMemo(() => getGroups(keys), [keys]);

  // useEffect(() => {
  //
  //   // let groups = sample.map((record) => {
  //   //   const arr = record.key.split('_');
  //   //   if ( null == arr[0] )
  //   //     return record.key;
  //   //   return arr[0];
  //   // });
  //   // // a,b,c,c,d,d,
  //   // console.log(`groups=${groups}`);
  //
  //   // groups = sample.reduce((acc, item) => {
  //   //   const prefix = item.key.split('_')[0];
  //   //   // console.log(`prefix=${JSON.stringify(prefix)}`);
  //   //
  //   //   if (!acc[prefix]) {
  //   //     acc[prefix] = [];
  //   //   }
  //   //   acc[prefix].push(item);
  //   //   return acc;
  //   // }, {});
  //   // console.log(group);
  //
  //   return () => {
  //   };
  // }, []);

  return (
    <TreeView
      className={classes.root}
      defaultExpanded={['0']}
      defaultCollapseIcon={<ArrowDropDownIcon />}
      defaultExpandIcon={<ArrowRightIcon />}
      defaultEndIcon={<div style={{ width: 24 }} />}
    >
    { Object.entries(newGroups).map(([key, value], index) => (
        value.length > 1 ?
          <StyledTreeItem
            key={`${key}_${index}`}
            nodeId={index.toString()}
            labelText={key}
            labelIcon={Label}
            onClick={(event) => onSelectGroupKey(key)}
          >
            {
              value.map((record) => (
                <StyledTreeItem
                  key={record.key}
                  nodeId={record.key}
                  labelText={record.key}
                  labelIcon={VpnKeyOutlinedIcon}
                  onClick={(event) => onSelectKey(record.key)}
                />
              ))
            }
          </StyledTreeItem>
        :
          <StyledTreeItem
            key={key}
            nodeId={index.toString()}
            labelText={key}
            labelIcon={VpnKeyOutlinedIcon}
            onClick={(event) => onSelectKey(key)}
          />
      ))
    }
    </TreeView>
  );
}
